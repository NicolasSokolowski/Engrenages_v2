import { pool } from "../../database/pg.client";
import { TableNames } from "../../helpers/TableNames";
import { CoreDatamapper, UserDatamapperReq } from "../index.datamappers";

export class UserDatamapper extends CoreDatamapper<UserDatamapperReq> {
  readonly tableName = TableNames.User;
  pool = pool;
}