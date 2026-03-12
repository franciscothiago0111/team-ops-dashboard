import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { UpdateTeamInput } from "../_schemas/team.schema";
import { TeamService } from "../_services/team.service";

export function useUpdateTeam() {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateTeamInput & { id: string }) => TeamService.update(data),
    onSuccess: () => {
      toast.success("Time atualizado com sucesso!");

      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao atualizar time.");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
