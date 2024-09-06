import { LocationTypeDatamapperReq } from "../../../datamappers/interfaces/structure/LocationTypeDatamapperReq";
import { EntityControllerReq } from "../../index.controllers";

type LocationTypeDatamapperReqWithoutData = Omit<LocationTypeDatamapperReq, "data">;

export interface LocationTypeControllerReq extends EntityControllerReq {
  datamapper: LocationTypeDatamapperReqWithoutData;
}