import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { TeamService } from "../_services/team.service";

export function useDeleteTeam() {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => TeamService.delete(id),
    onSuccess: () => {
      toast.success("Time excluído com sucesso!");

      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao excluir time.");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
