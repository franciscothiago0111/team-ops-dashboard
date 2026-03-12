import { useQuery } from "@tanstack/react-query";
import { IPagination } from "@/shared/types/pagination";
import { EmployeeService, IEmployeeListParams } from "../_services/employee.service";
import { User } from "@/shared/types";

export function useEmployeeList(params: IEmployeeListParams = {}) {
  const query = useQuery<IPagination<User>, Error>({
    queryKey: ["employees", params],
    queryFn: () => EmployeeService.list(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return query;
}
