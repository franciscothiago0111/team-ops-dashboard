import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamService } from "../_services/team.service";
import { User } from "@/shared/types";

export function useTeamMembers(teamId: string) {
  const query = useQuery<User[], Error>({
    queryKey: ["teams", teamId, "members"],
    queryFn: () => TeamService.getMembers(teamId),
    enabled: !!teamId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return query;
}

export function useAddTeamMember() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      TeamService.addMember(teamId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["teams", variables.teamId, "members"],
      });
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });

  return mutation;
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      TeamService.removeMember(teamId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["teams", variables.teamId, "members"],
      });
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });

  return mutation;
}
