import { api } from "@/core/api/http";
import { User } from "@/shared/types";
import { IPagination } from "@/shared/types/pagination";

export interface IEmployeeListParams {
  page?: number;
  limit?: number;
  name?: string;
  department?: string;
  position?: string;
  teamId?: string;
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
  list: async (params: IEmployeeListParams = {}): Promise<IPagination<User>> => {
    return await api.get<IPagination<User>>("/users", {
      params: { ...params },
    });
  },

  getById: async (id: string): Promise<User> => {
    return await api.get<User>(`/users/${id}`);
  },

  create: async (data: ICreateEmployeeData): Promise<User> => {
    return await api.post<User>("/users", data);
  },

  update: async ({ id, ...data }: IUpdateEmployeeData): Promise<User> => {
    return await api.put<User>(`/users/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<void>(`/users/${id}`);
  },
};
