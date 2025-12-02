"use client";

import { useQuery } from "@tanstack/react-query";
import { MetricsService, IMetricsFilters } from "../_services/metrics.service";
import { MetricsResponse } from "@/shared/types/metrics";

export function useMetrics(filters: IMetricsFilters = {}) {
  return useQuery<MetricsResponse>({
    queryKey: ["metrics", filters],
    queryFn: () => MetricsService.getMetrics(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
