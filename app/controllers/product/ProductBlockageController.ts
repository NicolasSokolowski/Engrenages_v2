import { BlockageDatamapperReq } from "../../datamappers/interfaces/product/BlockageDatamapperReq";
import { BadRequestError } from "../../errors/BadRequestError.error";
import { CoreController } from "../CoreController";
import { productController } from "../index.controllers";
import { BlockageControllerReq } from "../interfaces/product/ProductBlockageControllerReq";

export class ProductBlockageController extends CoreController<BlockageControllerReq, BlockageDatamapperReq> {

  constructor(datamapper: BlockageControllerReq["datamapper"]) {
    const field = "name";
    super(datamapper, field);
    this.datamapper = datamapper;
  }

  preDeletionCheck = async (field: string, value:any): Promise<void> => {
    const checkIfUsed = await productController.datamapper.findBySpecificField("product_blockage_name", value[field]);

    if (checkIfUsed) {
      throw new BadRequestError("Item still in use.")
    }
  }
};