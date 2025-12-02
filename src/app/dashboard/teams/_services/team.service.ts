import { api } from "@/core/api/http";
import { Team } from "@/shared/types/team";
import { IPagination } from "@/shared/types/pagination";
import { User } from "@/shared/types";

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
  list: async (params: ITeamListParams = {}): Promise<IPagination<Team>> => {
    return await api.get<IPagination<Team>>("/teams", {
      params: { ...params },
    });
  },

  getById: async (id: string): Promise<Team> => {
    return await api.get<Team>(`/teams/${id}`);
  },

  create: async (data: ICreateTeamData): Promise<Team> => {
    return await api.post<Team>("/teams", data);
  },

  update: async ({ id, ...data }: IUpdateTeamData): Promise<Team> => {
    return await api.put<Team>(`/teams/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<void>(`/teams/${id}`);
  },

  getMembers: async (teamId: string): Promise<User[]> => {
    return await api.get<User[]>(`/teams/${teamId}/members`);
  },

  addMember: async (teamId: string, userId: string): Promise<void> => {
    await api.post<void>(`/teams/${teamId}/members`, { userId });
  },

  removeMember: async (teamId: string, userId: string): Promise<void> => {
    await api.delete<void>(`/teams/${teamId}/members/${userId}`);
  },
};
