import type { IBaseEntity } from ".";
import type { ITask } from "./task";
import type { IUser } from "./user";

export interface ITeam extends IBaseEntity {
  name: string;
  description?: string;
  managerId: string;
  manager?: IUser;
  companyId: string;
  members?: IUser[];
  tasks?: ITask[];
}
