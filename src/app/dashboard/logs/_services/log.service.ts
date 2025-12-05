import { api } from "@/core/api/http";
import { LogEntry } from "@/shared/types/log-entry";
import { IPagination } from "@/shared/types/pagination";

export interface ILogListParams {
  page?: number;
  limit?: number;
  entity?: string;
}

export const LogService = {
  list: async (params: ILogListParams = {}): Promise<IPagination<LogEntry>> => {
    return await api.get<IPagination<LogEntry>>("/logs", {
      params: { ...params },
    });
  },

  getById: async (id: string): Promise<LogEntry> => {
    return await api.get<LogEntry>(`/logs/${id}`);
  },
};
