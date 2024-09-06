import { ProductDatamapperReq } from "../../../datamappers/interfaces/product/ProductDatamapperReq";
import { EntityControllerReq } from "../EntityControllerReq";

type ProductDatamapperReqWithoutData = Omit<ProductDatamapperReq, "data">;

export interface ProductControllerReq extends EntityControllerReq {
  datamapper: ProductDatamapperReqWithoutData;
}