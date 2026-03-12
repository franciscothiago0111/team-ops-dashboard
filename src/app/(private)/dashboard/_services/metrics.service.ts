import { api } from "@/core/api/http";
import { MetricsResponse } from "@/shared/types/metrics";

export interface IMetricsFilters {
  startDate?: string;
  endDate?: string;
  teamId?: string;
  userId?: string;
  taskStatus?: string;
  priority?: string;
}

export const MetricsService = {
  getMetrics: async (filters: IMetricsFilters = {}): Promise<MetricsResponse> => {
    return await api.get<MetricsResponse>("/metrics", {
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  },
};
