import { useQuery } from "@tanstack/react-query";
import type { ITask } from "@/shared/types/task";
import { TaskService } from "../_services/task.service";

export function useTaskDetails(id: string) {
  const query = useQuery<ITask, Error>({
    queryKey: ["tasks", id],
    queryFn: () => TaskService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return query;
}
