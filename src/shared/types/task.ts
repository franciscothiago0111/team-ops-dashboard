import type { IBaseEntity } from ".";
import type { ITeam } from "./team";
import type { IUser } from "./user";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";


export interface ITask extends IBaseEntity {
  name: string;
  description: string;
  status: TaskStatus;
  assignedToId: string;
  assignedTo?: IUser;

  createdById: string;
  teamId: string;
  team?: ITeam;
  createdBy?: IUser;

  files?: File[];



  priority: TaskPriority;
  dueDate: string;

}
