import { useQuery } from "@tanstack/react-query";
import { Team } from "@/shared/types/team";
import { TeamService } from "../_services/team.service";

export function useTeamDetails(id: string) {
  const query = useQuery<Team, Error>({
    queryKey: ["teams", id],
    queryFn: () => TeamService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return query;
}
