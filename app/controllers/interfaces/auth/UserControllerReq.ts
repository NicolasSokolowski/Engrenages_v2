import { UserDatamapperReq } from "../../../datamappers/index.datamappers";
import { EntityControllerReq } from "../EntityControllerReq";

export type UserDatamapperReqWithtoutData = Omit<UserDatamapperReq, "data">;

export interface UserControllerReq extends EntityControllerReq {
  datamapper: UserDatamapperReqWithtoutData;
}