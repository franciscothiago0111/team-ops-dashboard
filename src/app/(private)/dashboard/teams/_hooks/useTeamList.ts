import { useQuery } from "@tanstack/react-query";
import type { ITeam } from "@/shared/types/team";
import type { IPagination } from "@/shared/types/pagination";
import type { ITeamListParams } from "../_services/team.service";
import { TeamService } from "../_services/team.service";

export function useTeamList(params: ITeamListParams = {}) {
  const query = useQuery<IPagination<ITeam>, Error>({
    queryKey: ["teams", params],
    queryFn: () => TeamService.list(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return query;
}
