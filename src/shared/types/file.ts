import { BaseEntity } from "./base";

export interface File extends BaseEntity {
  filename: string;
  filepath: string;
  size: number;
  mimetype: string;
  taskId: string;
}