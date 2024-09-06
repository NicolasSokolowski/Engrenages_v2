import { BlockageDatamapperReq } from "../../../datamappers/interfaces/product/BlockageDatamapperReq";
import { EntityControllerReq } from "../EntityControllerReq";

type BlockageDatamapperReqWithoutData = Omit<BlockageDatamapperReq, "data">

export interface BlockageControllerReq extends EntityControllerReq {
  datamapper: BlockageDatamapperReqWithoutData;
};