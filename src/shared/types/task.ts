export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface TaskFile {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignedToId: string | null;
  assignedTo?: {
    id: string;
    name: string;
  } | null;
  createdById: string;
  createdBy?: {
    id: string;
    name: string;
  } | null;
  teamId: string;
  team?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt?: string;
  priority: TaskPriority;
  dueDate: string | null;
  labels: string[];
  files?: TaskFile[];
}
