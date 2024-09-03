import { pool } from "../../database/pg.client";
import { TableNames } from "../../helpers/TableNames";
import { CoreDatamapper } from "../CoreDatamapper";
import { RoleDatamapperReq } from "../interfaces/auth/RoleDatamapperReq";

export class RoleDatamapper extends CoreDatamapper<RoleDatamapperReq> {
  readonly tableName = TableNames.Role;
  pool = pool;
}