import { TableNames } from "../../../helpers/TableNames";
import { EntityDatamapperReq } from "../EntityDatamapperReq";

export interface LocationBlockageDatamapperReq extends EntityDatamapperReq {
  readonly tableName: TableNames;
  data: {
    id?: number;
    name: string;
    description: string;
  }
}