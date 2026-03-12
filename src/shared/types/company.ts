import type { IBaseEntity } from ".";
import type { ITeam } from "./team";
import type { IUser } from "./user";

export interface ICompany extends IBaseEntity {
  name: string;
  adminId: string;


  users?: IUser[];
  teams?: ITeam[];
}
