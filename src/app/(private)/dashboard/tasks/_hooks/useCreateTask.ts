import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { CreateTaskInput } from "../_schemas/task.schema";
import { TaskService } from "../_services/task.service";

interface CreateTaskWithFilesInput {
  data: CreateTaskInput;
  files?: File[];
}

export function useCreateTask() {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ data, files }: CreateTaskWithFilesInput) => {
      // First, create the task
      const createdTask = await TaskService.create(data);

      // If there are files, upload them
      if (files && files.length > 0) {
        try {
          await TaskService.uploadFiles(createdTask.id, files);
        } catch (error) {
          // Task was created but file upload failed
          toast.error("Tarefa criada, mas houve erro ao enviar os arquivos.");
          throw error;
        }
      }

      return createdTask;
    },
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
