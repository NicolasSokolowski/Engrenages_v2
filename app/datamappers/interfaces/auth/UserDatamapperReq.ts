import { TableNames } from "../../../helpers/TableNames";
import { EntityDatamapperReq } from "../EntityDatamapperReq";

export interface UserDatamapperReq extends EntityDatamapperReq {
  tableName: TableNames.User;
  data: {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role_name: string;
  }
}