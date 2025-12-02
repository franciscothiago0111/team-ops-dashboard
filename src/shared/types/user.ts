import { BaseEntity } from "./base";

export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface User extends BaseEntity {
  email: string;
  password: string;
  name: string;
  role: Role;
  companyId: string | null;
  managerId: string | null;
  teamId: string | null;
}
