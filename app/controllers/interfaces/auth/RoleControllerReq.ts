import { RoleDatamapperReq } from "../../../datamappers/index.datamappers";
import { EntityControllerReq } from "../EntityControllerReq";

type RoleDatamapperReqWithoutData = Omit<RoleDatamapperReq, "data">

export interface RoleControllerReq extends EntityControllerReq {
  datamapper: RoleDatamapperReqWithoutData;
};