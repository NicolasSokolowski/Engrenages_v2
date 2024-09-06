import { pool } from "../../database/pg.client";
import { TableNames } from "../../helpers/TableNames";
import { CoreDatamapper } from "../CoreDatamapper";
import { BlockageDatamapperReq } from "../interfaces/product/BlockageDatamapperReq";

export class ProductBlockageDatamapper extends CoreDatamapper<BlockageDatamapperReq> {
  readonly tableName = TableNames.ProductBlockage;
  pool = pool;
}