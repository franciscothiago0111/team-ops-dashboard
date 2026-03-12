import { useQuery } from "@tanstack/react-query";
import type { ITask } from "@/shared/types/task";
import type { IPagination } from "@/shared/types/pagination";
import type { ITaskListParams } from "../_services/task.service";
import { TaskService } from "../_services/task.service";

export function useTaskList(params: ITaskListParams = {}) {
  const query = useQuery<IPagination<ITask>, Error>({
    queryKey: ["tasks", params],
    queryFn: () => TaskService.list(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return query;
}
