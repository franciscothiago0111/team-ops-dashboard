import { useQuery } from "@tanstack/react-query";
import type { IPagination } from "@/shared/types/pagination";
import type { IEmployeeListParams } from "../_services/employee.service";
import { EmployeeService } from "../_services/employee.service";
import type { IUser } from "@/shared/types";

export function useEmployeeList(params: IEmployeeListParams = {}) {
  const query = useQuery<IPagination<IUser>, Error>({
    queryKey: ["employees", params],
    queryFn: () => EmployeeService.list(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return query;
}
