import { User } from "./user";

export interface ILogEntry {
  id: string;
  action: string;
  metadata: Record<string, unknown> | null;
  companyId: string;
  createdAt: string;
  entity: string;
  user?: User | null;
}
