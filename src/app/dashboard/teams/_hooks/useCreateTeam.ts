import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { CreateTeamInput } from "../_schemas/team.schema";
import { TeamService } from "../_services/team.service";

export function useCreateTeam() {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateTeamInput) => TeamService.create(data),
    onSuccess: (newTeam) => {
      console.log('newTeam', newTeam);

      toast.success("Time criado com sucesso!");

      // Invalidate all team queries to refetch with updated data
      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao criar time.");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
