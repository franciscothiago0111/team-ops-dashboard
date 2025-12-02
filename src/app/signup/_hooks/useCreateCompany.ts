import { useMutation } from "@tanstack/react-query";
import { companyService } from "../_services/company.service";
import { CreateCompanyInput } from "../_schemas/company.schema";
import { useAppToast } from "@/core/hooks/useToast";
import { ApiError } from "@/core/api/interceptors/error.interceptor";

export function useCreateCompany() {
  const toast = useAppToast();

  const mutation = useMutation({
    mutationFn: (data: CreateCompanyInput) => companyService.create(data),
    onSuccess: () => {
      toast.success("Empresa criada com sucesso!");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao criar empresa");
      }
    },
  });

  return {
    execute: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
