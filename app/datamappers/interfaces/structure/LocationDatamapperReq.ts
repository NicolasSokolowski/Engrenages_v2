import { TableNames } from "../../../helpers/TableNames";
import { EntityDatamapperReq } from "../EntityDatamapperReq";

export interface LocationDatamapperReq extends EntityDatamapperReq {
  readonly tableName: TableNames;
  data: {
    id?: number;
    zone: string;
    alley: string;
    position: string;
    lvl: string;
    lvl_position: string;
    location_type_name: string;
    location_blockage_name?: string;
  }
}