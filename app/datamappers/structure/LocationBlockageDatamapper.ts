import { pool } from "../../database/pg.client";
import { TableNames } from "../../helpers/TableNames";
import { CoreDatamapper } from "../CoreDatamapper";
import { LocationBlockageDatamapperReq } from "../interfaces/structure/LocationBlockageDatamapperReq";

export class LocationBlockageDatamapper extends CoreDatamapper<LocationBlockageDatamapperReq> {
  readonly tableName = TableNames.LocationBlockageType;
  pool = pool;
}