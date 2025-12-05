import { useQuery } from "@tanstack/react-query";
import { IPagination } from "@/shared/types/pagination";
import { LogService, ILogListParams } from "../_services/log.service";
import { LogEntry } from "@/shared/types/log-entry";

export function useLogList(params: ILogListParams = {}) {
  const query = useQuery<IPagination<LogEntry>, Error>({
    queryKey: ["logs", params],
    queryFn: () => LogService.list(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return query;
}
