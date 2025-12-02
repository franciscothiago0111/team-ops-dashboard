import { BaseEntity } from ".";
import { Team } from "./team";
import { User } from "./user";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";


export interface Task extends BaseEntity {
  name: string;
  description: string;
  status: TaskStatus;
  assignedToId: string;
  assignedTo?: User;

  createdById: string;
  teamId: string;
  team?: Team;
  createdBy?: User;



  priority: TaskPriority;
  dueDate?: string;

}
