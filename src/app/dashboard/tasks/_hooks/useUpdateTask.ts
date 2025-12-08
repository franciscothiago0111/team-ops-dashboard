import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { UpdateTaskInput } from "../_schemas/task.schema";
import { TaskService } from "../_services/task.service";

interface UpdateTaskWithFilesInput {
  data: UpdateTaskInput & { id: string };
  files?: File[];
}

export function useUpdateTask() {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ data, files }: UpdateTaskWithFilesInput) => {
      // First, update the task
      const updatedTask = await TaskService.update(data);

      // If there are files, upload them
      if (files && files.length > 0) {
        try {
          await TaskService.uploadFiles(data.id, files);
        } catch (error) {
          // Task was updated but file upload failed
          toast.error("Alterações salvas, mas houve erro ao enviar os arquivos.");
          throw error;
        }
      }

      return updatedTask;
    },
    onSuccess: (_, variables) => {
      toast.success("Tarefa atualizada com sucesso!");

      setTimeout(() => {
        // Invalidate the specific task query to refetch with updated files
        queryClient.invalidateQueries({
          queryKey: ["tasks", variables.data.id],
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
        toast.error("Erro ao atualizar tarefa.");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
