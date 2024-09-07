import { ProductDatamapperReq } from "../../datamappers/interfaces/product/ProductDatamapperReq";
import { BadRequestError } from "../../errors/BadRequestError.error";
import { CoreController } from "../CoreController";
import { locationController } from "../index.controllers";
import { ProductControllerReq } from "../interfaces/product/ProductControllerReq";

export class ProductController extends CoreController<ProductControllerReq, ProductDatamapperReq> {
  constructor(datamapper: ProductControllerReq["datamapper"]) {
    const field = "reference";
    super(datamapper, field);
    this.datamapper = datamapper;
  }

  preDeletionCheck = async (field: string, value:any): Promise<void> => {
    const checkIfUsed = await locationController.datamapper.findBySpecificField("product_reference", value[field]);

    if (checkIfUsed) {
      throw new BadRequestError("Item still in use.")
    }
  }
}