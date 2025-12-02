import { BaseEntity } from "./base";
import { Employee } from "./employee";
import { Task } from "./task";

export interface Team extends BaseEntity {
  name: string;
  description?: string;
  managerId: string;
  companyId: string;
  members?: Employee[];
  tasks?: Task[];
}
