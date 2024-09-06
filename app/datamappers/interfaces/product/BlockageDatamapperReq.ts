import { TableNames } from "../../../helpers/TableNames";
import { EntityDatamapperReq } from "../EntityDatamapperReq";

export interface BlockageDatamapperReq extends EntityDatamapperReq {
  tableName: TableNames.ProductBlockage;
  data: {
    id?: number;
    name: string;
    description: string;
  }
}