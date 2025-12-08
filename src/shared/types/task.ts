import { BaseEntity } from ".";
import { File } from "./file";
import { Team } from "./team";
import { User } from "./user";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
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

  files?: File[];



  priority: TaskPriority;
  dueDate: string;

}
