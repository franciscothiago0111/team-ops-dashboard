import type { Role } from "./user";
import { BaseEntity } from "./base";

export interface Manager extends BaseEntity {
  email: string;
  name: string;
  role: Role;
  companyId: string | null;
  managerId: string | null;
  teamId: string | null;
}
