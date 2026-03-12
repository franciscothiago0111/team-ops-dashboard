import type { IBaseEntity } from "./base";
import type { ICompany } from "./company";
import type { ITask } from "./task";
import type { ITeam } from "./team";

export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface IUser extends IBaseEntity {
  email: string;
  password: string;
  name: string;
  role: Role;
  companyId: string | null;
  teamId: string | null;
  tasks?: ITask[];

  adminCompanyId?: string | null;

  adminCompany?: ICompany;
  team?: ITeam;
}
