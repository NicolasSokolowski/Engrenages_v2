import { LocationDatamapperReq } from "../../../datamappers/interfaces/structure/LocationDatamapperReq";
import { EntityControllerReq } from "../EntityControllerReq";

type LocationDatamapperReqWithoutData = Omit<LocationDatamapperReq, "data">;

export interface LocationControllerReq extends EntityControllerReq {
  datamapper: LocationDatamapperReqWithoutData;
}