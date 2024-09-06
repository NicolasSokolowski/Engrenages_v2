import { Request, Response } from "express";
import { LocationTypeDatamapperReq } from "../../datamappers/interfaces/structure/LocationTypeDatamapperReq";
import { CoreController } from "../index.controllers";
import { LocationTypeControllerReq } from "../interfaces/structure/LocationTypeControllerReq";
import { NotFoundError } from "../../errors/NotFoundError.error";
import { DatabaseConnectionError } from "../../errors/DatabaseConnectionError.error";
import { BadRequestError } from "../../errors/BadRequestError.error";

export class LocationTypeController extends CoreController<LocationTypeControllerReq, LocationTypeDatamapperReq> {
  constructor(datamapper: LocationTypeControllerReq["datamapper"]) {
    super(datamapper);
    this.datamapper = datamapper;
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    let data = req.body;

    if (data.name) {
      const checkIfTypeExists = await this.datamapper.findBySpecificField("name", data.name);

      if (checkIfTypeExists) {
        throw new BadRequestError(`Location type ${data.name} already exists.`)
      }
    }

    const itemToUpdate = await this.datamapper.findByPk(id);

    if (!itemToUpdate) {
      throw new NotFoundError();
    }

    const updateFields = [
      'name', 
      'description', 
      'length', 
      'width', 
      'height'
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
}