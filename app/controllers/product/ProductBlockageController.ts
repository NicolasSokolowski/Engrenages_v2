import { Request, Response } from "express";
import { BlockageDatamapperReq } from "../../datamappers/interfaces/product/BlockageDatamapperReq";
import { CoreController } from "../CoreController";
import { BlockageControllerReq } from "../interfaces/product/ProductBlockageControllerReq";
import { BadRequestError, DatabaseConnectionError, NotFoundError } from "../../errors/index.errors";

export class ProductBlockageController extends CoreController<BlockageControllerReq, BlockageDatamapperReq> {

  constructor(datamapper: BlockageControllerReq["datamapper"]) {
    super(datamapper);
    this.datamapper = datamapper;
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    let data = req.body;

    if (data.name) {
      const checkIfTypeExists = await this.datamapper.findBySpecificField("name", data.name);

      if (checkIfTypeExists) {
        throw new BadRequestError(`Product blockage type ${data.name} already exists.`)
      }
    }

    const itemToUpdate = await this.datamapper.findByPk(id);

    if (!itemToUpdate) {
      throw new NotFoundError();
    }

    const updateFields = [
      'name', 
      'description'
    ];

    for (const field of updateFields) {
      if (data[field] === undefined) {
        data[field] = itemToUpdate[field];
      }
    }

    data = {
      ...data,
      id
    }

    const updatedItem = await this.datamapper.update(data);

    if (!updatedItem) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(updatedItem);
  }
};