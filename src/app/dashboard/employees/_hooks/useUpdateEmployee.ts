import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { UpdateEmployeeInput } from "../_schemas/employee.schema";
import { EmployeeService } from "../_services/employee.service";

export function useUpdateEmployee(id: string) {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateEmployeeInput) => EmployeeService.update({ id, ...data }),
    onSuccess: () => {
      toast.success("Colaborador atualizado com sucesso!");

      // Invalidate employee queries to refetch with updated data
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao atualizar colaborador");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
