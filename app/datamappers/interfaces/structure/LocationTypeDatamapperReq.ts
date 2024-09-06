import { TableNames } from "../../../helpers/TableNames";
import { EntityDatamapperReq } from "../EntityDatamapperReq";

export interface LocationTypeDatamapperReq extends EntityDatamapperReq {
  tableName: TableNames;
  data: {
    id?: number;
    name: string;
    description: string;
    length: number;
    width: number;
    height: number;
  }
}