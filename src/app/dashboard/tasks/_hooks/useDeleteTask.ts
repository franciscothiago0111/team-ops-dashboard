import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { TaskService } from "../_services/task.service";

export function useDeleteTask() {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => TaskService.delete(id),
    onSuccess: () => {
      toast.success("Tarefa excluída com sucesso!");

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao excluir tarefa.");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
