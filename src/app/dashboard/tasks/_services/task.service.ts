import { api } from "@/core/api/http";
import { Task, TaskPriority, TaskStatus } from "@/shared/types/task";
import { IPagination } from "@/shared/types/pagination";

export interface ITaskListParams {
  page?: number;
  limit?: number;
  name?: string;
  status?: string;
  assignedToId?: string;
  teamId?: string;
  priority?: string;
}

export interface ICreateTaskData {
  name: string;
  description: string;
  assignedToId: string;
  teamId: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface IUpdateTaskData {
  id: string;
  name?: string;
  description?: string;
  assignedToId?: string;
  teamId?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
  status?: TaskStatus;
  labels?: string[];
}

export const TaskService = {
  list: async (params: ITaskListParams = {}): Promise<IPagination<Task>> => {
    return await api.get<IPagination<Task>>("/tasks", {
      params: { ...params },
    });
  },

  getById: async (id: string): Promise<Task> => {
    return await api.get<Task>(`/tasks/${id}`);
  },

  create: async (data: ICreateTaskData): Promise<Task> => {
    return await api.post<Task>("/tasks", data);
  },

  update: async ({ id, ...data }: IUpdateTaskData): Promise<Task> => {
    return await api.put<Task>(`/tasks/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<void>(`/tasks/${id}`);
  },

  uploadFiles: async (taskId: string, files: File[]): Promise<Task> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    return await api.post<Task>(`/tasks/${taskId}/files`, formData);
  },

  deleteFile: async (taskId: string, fileId: string): Promise<void> => {
    await api.delete<void>(`/tasks/${taskId}/files/${fileId}`);
  },
};
