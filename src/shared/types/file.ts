import { BaseEntity } from "./base";

export interface IFile extends BaseEntity {
  filename: string;
  filepath: string;
  size: number;
  mimetype: string;
  taskId: string;
}