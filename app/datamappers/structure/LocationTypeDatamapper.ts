import { pool } from "../../database/pg.client";
import { TableNames } from "../../helpers/TableNames";
import { CoreDatamapper } from "../CoreDatamapper";
import { LocationTypeDatamapperReq } from "../interfaces/structure/LocationTypeDatamapperReq";

export class LocationTypeDatamapper extends CoreDatamapper<LocationTypeDatamapperReq> {
  readonly tableName = TableNames.LocationType;
  pool = pool;
}