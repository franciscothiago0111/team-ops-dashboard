export interface LogEntry {
  id: string;
  action: string;
  metadata: Record<string, unknown> | null;
  companyId: string;
  createdAt: string;
}
