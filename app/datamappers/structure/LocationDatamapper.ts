import { pool } from "../../database/pg.client";
import { TableNames } from "../../helpers/TableNames";
import { CoreDatamapper } from "../CoreDatamapper";
import { LocationDatamapperReq } from "../interfaces/structure/LocationDatamapperReq";

export class LocationDatamapper extends CoreDatamapper<LocationDatamapperReq> {
  readonly tableName = TableNames.Location;
  pool = pool;
}