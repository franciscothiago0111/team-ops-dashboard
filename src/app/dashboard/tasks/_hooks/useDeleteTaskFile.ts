import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { TaskService } from "../_services/task.service";

interface DeleteFileParams {
  taskId: string;
  fileId: string;
}

export function useDeleteTaskFile() {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ taskId, fileId }: DeleteFileParams) =>
      TaskService.deleteFile(taskId, fileId),
    onSuccess: (_, variables) => {
      toast.success("Arquivo removido com sucesso!");
      // Add a small delay before invalidating queries to ensure backend has processed the deletion
      setTimeout(() => {
        // Invalidate the specific task query to refetch with updated files
        queryClient.invalidateQueries({
          queryKey: ["tasks", variables.taskId],
        });
        // Also invalidate the task list
        queryClient.invalidateQueries({
          queryKey: ["tasks"],
        });
      }, 1000);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao remover arquivo");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
