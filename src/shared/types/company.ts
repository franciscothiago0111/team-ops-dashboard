import { BaseEntity } from ".";
import { Team } from "./team";
import { User } from "./user";

export interface Company extends BaseEntity {
  name: string;
  adminId: string;


  users?: User[];
  teams?: Team[];
}
