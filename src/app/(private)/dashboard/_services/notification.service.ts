import { api } from "@/core/api/http";
import { Notification } from "@/shared/types/notification";
import { IPagination } from "@/shared/types/pagination";

export interface INotificationListParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
}

export const NotificationService = {
  list: async (params: INotificationListParams = {}): Promise<IPagination<Notification>> => {
    return await api.get<IPagination<Notification>>("/notifications", {
      params: { ...params },
    });
  },

  markAsRead: async (id: string): Promise<Notification> => {
    return await api.patch<Notification>(`/notifications/${id}/read`, {});
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch<void>("/notifications/read-all", {});
  },

  getUnreadCount: async (): Promise<number> => {
    const result = await api.get<{ count: number }>("/notifications/unread-count");
    return result.count;
  },
};
