import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { IPagination } from "@/shared/types/pagination";
import { EmployeeService } from "../_services/employee.service";
import { User } from "@/shared/types";

export function useDeleteEmployee() {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => EmployeeService.delete(id),
    onSuccess: (_, deletedId) => {
      toast.success("Colaborador removido com sucesso!");

      // Remove the employee from cache instead of invalidating
      queryClient.setQueryData<IPagination<User>>(
        ["employees", {}],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter((employee) => employee.id !== deletedId),
            total: oldData.total - 1,
          };
        }
      );
    },
    onError: (error: unknown) => {
      console.error("Error deleting employee:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível remover o colaborador");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
