import type { IBaseEntity } from "./base";

export interface IFile extends IBaseEntity {
  filename: string;
  filepath: string;
  size: number;
  mimetype: string;
  taskId: string;
}