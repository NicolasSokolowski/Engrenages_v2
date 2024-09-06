import { LocationBlockageDatamapperReq } from "../../../datamappers/interfaces/structure/LocationBlockageDatamapperReq";
import { EntityControllerReq } from "../EntityControllerReq";

type LocationBlockageReqWithoutData = Omit<LocationBlockageDatamapperReq, "data">;

export interface LocationBlockageControllerReq extends EntityControllerReq {
  datamapper: LocationBlockageReqWithoutData;
}