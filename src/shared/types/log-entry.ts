import { User } from "./user";

export interface LogEntry {
  id: string;
  action: string;
  metadata: Record<string, unknown> | null;
  companyId: string;
  createdAt: string;
  entity: string;
  user?: User | null;
}
