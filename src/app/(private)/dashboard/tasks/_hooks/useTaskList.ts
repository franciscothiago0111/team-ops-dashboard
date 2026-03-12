import { useQuery } from "@tanstack/react-query";
import { Task } from "@/shared/types/task";
import { IPagination } from "@/shared/types/pagination";
import { TaskService, ITaskListParams } from "../_services/task.service";

export function useTaskList(params: ITaskListParams = {}) {
  const query = useQuery<IPagination<Task>, Error>({
    queryKey: ["tasks", params],
    queryFn: () => TaskService.list(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return query;
}
