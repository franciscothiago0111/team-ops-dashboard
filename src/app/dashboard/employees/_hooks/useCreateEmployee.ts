import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { CreateEmployeeInput } from "../_schemas/employee.schema";
import { EmployeeService } from "../_services/employee.service";
import { ApiError } from "@/core/api/interceptors/error.interceptor";

export function useCreateEmployee() {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateEmployeeInput) => EmployeeService.create(data),
    onSuccess: (newEmployee) => {
      console.log('newEmployee', newEmployee);

      toast.success("Colaborador criado com sucesso!");

      // Invalidate all employee queries to refetch with updated data
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao criar colaborador");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
