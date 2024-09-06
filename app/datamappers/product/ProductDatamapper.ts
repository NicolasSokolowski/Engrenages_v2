import { pool } from "../../database/pg.client";
import { TableNames } from "../../helpers/TableNames";
import { CoreDatamapper } from "../CoreDatamapper";
import { ProductDatamapperReq } from "../interfaces/product/ProductDatamapperReq";

export class ProductDatamapper extends CoreDatamapper<ProductDatamapperReq> {
  readonly tableName = TableNames.Product;
  pool = pool;
}