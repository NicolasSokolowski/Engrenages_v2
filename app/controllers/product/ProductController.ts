import { Request, Response } from "express";
import { ProductDatamapperReq } from "../../datamappers/interfaces/product/ProductDatamapperReq";
import { BadRequestError, NotFoundError } from "../../errors/index.errors";
import { CoreController } from "../CoreController";
import { ProductControllerReq } from "../interfaces/product/ProductControllerReq";

export class ProductController extends CoreController<ProductControllerReq, ProductDatamapperReq> {
  constructor(datamapper: ProductControllerReq["datamapper"]) {
    super(datamapper);
    this.datamapper = datamapper;
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    let data = req.body;
    
    const itemToUpdate = await this.datamapper.findByPk(id);

    if (!itemToUpdate) {
      throw new NotFoundError();
    }

    if (data.reference) {
      const checkIfEntreeExists = await this.datamapper.findBySpecificField("reference", data.reference);

      if (checkIfEntreeExists) {
        throw new BadRequestError(`Product reference ${data.reference} already exists.`)
      }
    }

    data = {
      ...data,
      id
    }

    const updatedItem = await this.datamapper.update(data);
    
    res.status(200).send(updatedItem);

  }
}