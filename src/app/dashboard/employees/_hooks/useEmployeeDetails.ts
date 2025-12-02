import { useQuery } from "@tanstack/react-query";
import { EmployeeService } from "../_services/employee.service";
import { User } from "@/shared/types";

export function useEmployeeDetails(id: string) {
  const query = useQuery<User, Error>({
    queryKey: ["employees", id],
    queryFn: () => EmployeeService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return query;
}
