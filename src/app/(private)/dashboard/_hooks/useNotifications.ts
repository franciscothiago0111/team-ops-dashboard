import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Notification } from "@/shared/types/notification";
import { IPagination } from "@/shared/types/pagination";
import { NotificationService, INotificationListParams } from "../_services/notification.service";
import { getSocket } from "@/core/services/io.service";

export function useNotifications(params: INotificationListParams = {}) {
  const query = useQuery<IPagination<Notification>, Error>({
    queryKey: ["notifications", params],
    queryFn: () => NotificationService.list(params),
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnMount: true,
  });

  return query;
}



export function useMarkAsRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => NotificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });

  return mutation;
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });

  return mutation;
}

export function useUnreadCount() {
  const queryClient = useQueryClient();

  const query = useQuery<number, Error>({
    queryKey: ["notifications-unread-count"],
    queryFn: () => NotificationService.getUnreadCount(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Listen to socket events for real-time updates (both count and list)
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewNotification = (notification: Notification) => {
      console.log("🔔 New notification received, refreshing count and list...", notification);
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    const handleUpdateNotification = (notification: Notification) => {
      console.log("🔄 Notification updated, refreshing count and list...", notification);
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    socket.on("notification", handleNewNotification);
    socket.on("update-notification", handleUpdateNotification);

    return () => {
      socket.off("notification", handleNewNotification);
      socket.off("update-notification", handleUpdateNotification);
    };
  }, [queryClient]);

  return query;
}
