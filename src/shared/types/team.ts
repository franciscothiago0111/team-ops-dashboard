import { BaseEntity } from ".";
import { Task } from "./task";
import { User } from "./user";

export interface Team extends BaseEntity {
  name: string;
  description?: string;
  managerId: string;
  manager?: User;
  companyId: string;
  members?: User[];
  tasks?: Task[];
}
