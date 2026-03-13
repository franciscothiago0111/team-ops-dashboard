import { api } from "@/core/api/http";
import type { ITeam } from "@/shared/types/team";
import type { IPagination } from "@/shared/types/pagination";
import type { IUser } from "@/shared/types";

export interface ITeamListParams {
  page?: number;
  limit?: number;
  name?: string;
}

export interface ICreateTeamData {
  name: string;
  description?: string;
  memberIds?: string[];
}

export interface IUpdateTeamData extends Partial<ICreateTeamData> {
  id: string;
}

export const TeamService = {
  list: async (params: ITeamListParams = {}): Promise<IPagination<ITeam>> => {
    return await api.get<IPagination<ITeam>>("/teams", {
      params: { ...params },
    });
  },

  getById: async (id: string): Promise<ITeam> => {
    return await api.get<ITeam>(`/teams/${id}`);
  },

  create: async (data: ICreateTeamData): Promise<ITeam> => {
    return await api.post<ITeam>("/teams", data);
  },

  update: async ({ id, ...data }: IUpdateTeamData): Promise<ITeam> => {
    return await api.put<ITeam>(`/teams/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<void>(`/teams/${id}`);
  },

  getMembers: async (teamId: string): Promise<IUser[]> => {
    return await api.get<IUser[]>(`/teams/${teamId}/members`);
  },

  addMember: async (teamId: string, userId: string): Promise<void> => {
    await api.post<void>(`/teams/${teamId}/members`, { userId });
  },

  removeMember: async (teamId: string, userId: string): Promise<void> => {
    await api.delete<void>(`/teams/${teamId}/members/${userId}`);
  },
};
