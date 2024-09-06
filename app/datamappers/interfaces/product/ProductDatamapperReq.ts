import { TableNames } from "../../../helpers/TableNames";
import { EntityDatamapperReq } from "../EntityDatamapperReq";

export interface ProductDatamapperReq extends EntityDatamapperReq {
  tableName: TableNames.Product;
  data: {
    id?: number;
    title: string;
    description: string;
    ean: string;
    length: number;
    width: number;
    height: number;
    product_img: string;
    price: number;
    product_blockage_name?: string;
  };
}