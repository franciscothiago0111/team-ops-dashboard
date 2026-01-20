import { io, Socket } from 'socket.io-client';
import { getToken } from './storage.service';
import { Notification } from '@/shared/types/notification';

let socket: Socket | null = null;

interface AuthenticatedResponse {
  success: boolean;
  userId: string;
  companyId: string;
}

interface SocketResponse {
  success: boolean;
  message?: string;
  userId?: string;
  companyId?: string;
}

// Callback for new notifications
type NotificationCallback = (notification: Notification) => void;
let notificationCallbacks: NotificationCallback[] = [];

export function initSocket(): Socket | null {
  if (socket?.connected) {
    console.log('✅ Socket já conectado');
    return socket;
  }

  try {
    const token = getToken();
    if (!token) {
      console.error('❌ Token não encontrado');
      return null;
    }

    const URL_IO = process.env.URL_IO || 'http://localhost:3001';

    console.log('🔌 Conectando ao WebSocket:', { url: URL_IO });

    socket = io(`${URL_IO}/notifications`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('✅ Socket conectado! ID:', socket?.id);
      console.log('🌐 Transportes disponíveis:', socket?.io.engine.transport);
    });

    // Listen for successful authentication (auto-registered from token)
    socket.on('authenticated', (data: AuthenticatedResponse) => {
      console.log('✅ Autenticado com sucesso:', data);
      // User is auto-registered and auto-joined to company room
      // data contains: { success: true, userId: '...', companyId: '...' }
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Erro ao conectar:', error.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket desconectado. Motivo:', reason);
    });

    // Listen for authentication errors
    socket.on('error', (error: { message: string; error?: string }) => {
      console.error('❌ Erro de autenticação:', error);
    });

    // Listen for notifications
    socket.on('notification', (notification: Notification) => {
      console.log('🔔 Nova notificação recebida:', notification);
      // Trigger all registered callbacks
      notificationCallbacks.forEach((callback) => callback(notification));
    });

    return socket;
  } catch (error) {
    console.error('❌ Erro ao inicializar socket:', error);
    return null;
  }
}

// Register a callback to receive notifications
export function onNotification(callback: NotificationCallback): () => void {
  notificationCallbacks.push(callback);
  // Return unsubscribe function
  return () => {
    notificationCallbacks = notificationCallbacks.filter((cb) => cb !== callback);
  };
}

// Helper to join team room
export function joinTeam(teamId: string): Promise<SocketResponse> {
  return new Promise((resolve, reject) => {
    if (!socket?.connected) {
      reject(new Error('Socket não conectado'));
      return;
    }

    socket.emit('joinTeam', { teamId }, (response: SocketResponse) => {
      if (response.success) {
        console.log(`✅ Entrou na sala da equipe: ${teamId}`);
        resolve(response);
      } else {
        console.error(`❌ Erro ao entrar na sala da equipe: ${response.message}`);
        reject(new Error(response.message));
      }
    });
  });
}

// Helper to leave team room
export function leaveTeam(teamId: string): Promise<SocketResponse> {
  return new Promise((resolve, reject) => {
    if (!socket?.connected) {
      reject(new Error('Socket não conectado'));
      return;
    }

    socket.emit('leaveTeam', { teamId }, (response: SocketResponse) => {
      if (response.success) {
        console.log(`✅ Saiu da sala da equipe: ${teamId}`);
        resolve(response);
      } else {
        console.error(`❌ Erro ao sair da sala da equipe: ${response.message}`);
        reject(new Error(response.message));
      }
    });
  });
}

// Helper to join company room (usually auto-joined on connection)
export function joinCompany(companyId: string): Promise<SocketResponse> {
  return new Promise((resolve, reject) => {
    if (!socket?.connected) {
      reject(new Error('Socket não conectado'));
      return;
    }

    socket.emit('joinCompany', { companyId }, (response: SocketResponse) => {
      if (response.success) {
        console.log(`✅ Entrou na sala da empresa : ${companyId}`);
        resolve(response);
      } else {
        console.error(`❌ Erro ao entrar na sala da empresa: ${response.message}`);
        reject(new Error(response.message));
      }
    });
  });
}

export function closeSocket(): void {
  if (socket) {
    console.log('🛑 Fechando conexão do socket...');
    socket.disconnect();
    socket = null;
    notificationCallbacks = [];
  }
}

export function getSocket(): Socket | null {
  return socket;
}

export function isConnected(): boolean {
  return socket?.connected ?? false;
}