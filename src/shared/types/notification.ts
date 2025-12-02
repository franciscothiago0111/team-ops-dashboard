


import type { Role } from "./user";
import { BaseEntity } from "./base";

export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  read: boolean;
  readAt: Date | null;
  entityType: "Task" | "Team" | null;
  entityId: string | null;
  metadata: Record<string, unknown> | null;

}
