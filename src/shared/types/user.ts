import { BaseEntity } from "./base";
import { Company } from "./company";
import { Task } from "./task";
import { Team } from "./team";

export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface User extends BaseEntity {
  email: string;
  password: string;
  name: string;
  role: Role;
  companyId: string | null;
  teamId: string | null;
  tasks?: Task[];

  adminCompanyId?: string | null;

  adminCompany?: Company;
  team?: Team;
}
