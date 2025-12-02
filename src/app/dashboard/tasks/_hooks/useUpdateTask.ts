import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { UpdateTaskInput } from "../_schemas/task.schema";
import { TaskService } from "../_services/task.service";

export function useUpdateTask() {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateTaskInput & { id: string }) => TaskService.update(data),
    onSuccess: () => {
      toast.success("Tarefa atualizada com sucesso!");

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao atualizar tarefa.");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
