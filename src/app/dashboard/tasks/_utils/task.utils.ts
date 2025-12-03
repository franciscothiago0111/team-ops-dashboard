import { TaskStatus, TaskPriority } from "@/shared/types/task";
import { isPast, isToday, formatDistanceToNow, formatDate } from "@/core/utils/formatters";

/**
 * Configuration for task status display
 */
export const statusConfig: Record<TaskStatus, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: "Pendente", color: "text-amber-700", bgColor: "bg-amber-100" },
  IN_PROGRESS: { label: "Em Progresso", color: "text-blue-700", bgColor: "bg-blue-100" },
  COMPLETED: { label: "Concluída", color: "text-green-700", bgColor: "bg-green-100" },
  CANCELLED: { label: "Cancelada", color: "text-red-700", bgColor: "bg-red-100" },
};

/**
 * Configuration for task priority display (card version)
 */
export const priorityConfigCard: Record<TaskPriority, { label: string; color: string; bgColor: string }> = {
  LOW: { label: "Baixa", color: "text-green-700", bgColor: "bg-green-100" },
  MEDIUM: { label: "Média", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  HIGH: { label: "Alta", color: "text-orange-700", bgColor: "bg-orange-100" },
  URGENT: { label: "Urgente", color: "text-red-700", bgColor: "bg-red-100" },
};

/**
 * Configuration for task priority display (details version)
 */
export const priorityConfigDetails: Record<TaskPriority, { label: string; icon: string; color: string }> = {
  LOW: { label: "Baixa", icon: "🟢", color: "text-green-600" },
  MEDIUM: { label: "Média", icon: "🟡", color: "text-yellow-600" },
  HIGH: { label: "Alta", icon: "🟠", color: "text-orange-600" },
  URGENT: { label: "Urgente", icon: "🔴", color: "text-red-600" },
};

/**
 * Maps current status to the next status in the workflow
 */
export const nextStatus: Record<TaskStatus, TaskStatus | null> = {
  PENDING: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
  COMPLETED: null,
  CANCELLED: null,
};

/**
 * Labels for status transition buttons (card version)
 */
export const nextStatusLabelCard: Record<TaskStatus, string> = {
  PENDING: "Iniciar",
  IN_PROGRESS: "Concluir",
  COMPLETED: "",
  CANCELLED: "",
};

/**
 * Labels for status transition buttons (details version)
 */
export const nextStatusLabelDetails: Record<TaskStatus, string> = {
  PENDING: "Iniciar Tarefa",
  IN_PROGRESS: "Marcar como Concluída",
  COMPLETED: "",
  CANCELLED: "",
};

/**
 * Get due date information for task card display (relative time)
 */
export function getDueDateInfoCard(dueDate: Date | string | null | undefined, taskStatus: TaskStatus) {
  if (!dueDate) return null;

  const date = new Date(dueDate);
  const isOverdue = isPast(date) && taskStatus !== "COMPLETED";
  const isDueToday = isToday(date);

  return {
    text: formatDistanceToNow(date),
    isOverdue,
    isDueToday,
  };
}

/**
 * Get due date information for task details display (formatted date)
 */
export function getDueDateInfoDetails(dueDate: Date | string | null | undefined, taskStatus: TaskStatus) {
  if (!dueDate) return null;

  const date = new Date(dueDate);
  const isOverdue = isPast(date) && taskStatus !== "COMPLETED";
  const isDueToday = isToday(date);

  return {
    formatted: formatDate(date),
    isOverdue,
    isDueToday,
  };
}
