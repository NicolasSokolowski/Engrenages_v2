import { Request, Response } from "express";
import { LocationBlockageDatamapperReq } from "../../datamappers/interfaces/structure/LocationBlockageDatamapperReq";
import { CoreController } from "../CoreController";
import { LocationBlockageControllerReq } from "../interfaces/structure/LocationBlockageControllerReq";
import { BadRequestError } from "../../errors/BadRequestError.error";
import { DatabaseConnectionError } from "../../errors/DatabaseConnectionError.error";
import { NotFoundError } from "../../errors/NotFoundError.error";

export class LocationBlockageController extends CoreController<LocationBlockageControllerReq, LocationBlockageDatamapperReq> {
  constructor(datamapper: LocationBlockageControllerReq["datamapper"]) {
    super(datamapper);
    this.datamapper = datamapper;
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    let data = req.body;

    if (data.name) {
      const checkIfTypeExists = await this.datamapper.findBySpecificField("name", data.name);

      if (checkIfTypeExists) {
        throw new BadRequestError(`Location blockage type ${data.name} already exists.`)
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
}