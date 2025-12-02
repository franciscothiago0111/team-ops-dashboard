import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { CreateTaskInput } from "../_schemas/task.schema";
import { TaskService } from "../_services/task.service";

export function useCreateTask() {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateTaskInput) => TaskService.create(data),
    onSuccess: () => {
      toast.success("Tarefa criada com sucesso!");
      // Invalidate all task queries to refetch with updated data
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao criar tarefa");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
