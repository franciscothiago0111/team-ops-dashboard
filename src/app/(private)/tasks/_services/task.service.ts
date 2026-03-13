import { api } from "@/core/api/http";
import type { ITask, TaskPriority, TaskStatus } from "@/shared/types/task";
import type { IPagination } from "@/shared/types/pagination";

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
  list: async (params: ITaskListParams = {}): Promise<IPagination<ITask>> => {
    return await api.get<IPagination<ITask>>("/tasks", {
      params: { ...params },
    });
  },

  getById: async (id: string): Promise<ITask> => {
    return await api.get<ITask>(`/tasks/${id}`);
  },

  create: async (data: ICreateTaskData): Promise<ITask> => {
    return await api.post<ITask>("/tasks", data);
  },

  update: async ({ id, ...data }: IUpdateTaskData): Promise<ITask> => {
    return await api.put<ITask>(`/tasks/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<void>(`/tasks/${id}`);
  },

  uploadFiles: async (taskId: string, files: File[]): Promise<ITask> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file, file.name);
    });
    return await api.post<ITask>(`/tasks/${taskId}/upload`, formData);
  },

  deleteFile: async (taskId: string, fileId: string): Promise<ITask> => {
    return await api.delete<ITask>(`/tasks/${taskId}/files/${fileId}`);
  },
};
