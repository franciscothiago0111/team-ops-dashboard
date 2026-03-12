import { api } from "@/core/api/http";
import type { IUser } from "@/shared/types";
import type { IPagination } from "@/shared/types/pagination";

export interface IEmployeeListParams {
  page?: number;
  limit?: number;
  name?: string;
  role?: string;
  teamId?: string;
  withoutTeam?: boolean;
}

export interface ICreateEmployeeData {
  name: string;
  email: string;
  role: string;
}

export interface IUpdateEmployeeData extends Partial<ICreateEmployeeData> {
  id: string;
}

export const EmployeeService = {
  list: async (params: IEmployeeListParams = {}): Promise<IPagination<IUser>> => {
    return await api.get<IPagination<IUser>>("/users", {
      params: { ...params },
    });
  },

  getById: async (id: string): Promise<IUser> => {
    return await api.get<IUser>(`/users/${id}`);
  },

  create: async (data: ICreateEmployeeData): Promise<IUser> => {
    return await api.post<IUser>("/users", data);
  },

  update: async ({ id, ...data }: IUpdateEmployeeData): Promise<IUser> => {
    return await api.put<IUser>(`/users/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<void>(`/users/${id}`);
  },
};
