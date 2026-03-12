import { useQuery } from "@tanstack/react-query";
import { Team } from "@/shared/types/team";
import { IPagination } from "@/shared/types/pagination";
import { TeamService, ITeamListParams } from "../_services/team.service";

export function useTeamList(params: ITeamListParams = {}) {
  const query = useQuery<IPagination<Team>, Error>({
    queryKey: ["teams", params],
    queryFn: () => TeamService.list(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return query;
}
