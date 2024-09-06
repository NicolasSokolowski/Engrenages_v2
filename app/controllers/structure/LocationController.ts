import { Request, Response } from "express";
import { CoreController } from "../CoreController";
import { LocationControllerReq } from "../interfaces/structure/LocationControllerReq";
import { LocationDatamapperReq } from "../../datamappers/interfaces/structure/LocationDatamapperReq";
import { BadRequestError } from "../../errors/BadRequestError.error";
import { NotFoundError } from "../../errors/NotFoundError.error";

export class LocationController extends CoreController<LocationControllerReq, LocationDatamapperReq> {
  constructor(datamapper: LocationControllerReq["datamapper"]) {

    super(datamapper);
    this.datamapper = datamapper;
  }

  create = async (req: Request, res: Response) => {
    let data = req.body;

    const newLocation = `${data.zone}-${data.alley}-${data.position}-${data.lvl}-${data.lvl_position}`;

    const checkIfItemExists = await this.datamapper.findBySpecificField("location", newLocation);


    if (!checkIfItemExists) {
  
      data = {
        ...data,
        newLocation
      }

      const createdItem = await this.datamapper.insert(data);
      res.status(201).send(createdItem);

    } else {
      throw new BadRequestError(`Location ${newLocation} already exists.`)
    }
  }

  update = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    let data = req.body;

    const itemToUpdate = await this.datamapper.findByPk(id);

    if (!itemToUpdate) {
      throw new NotFoundError();
    }
    
    const updateFields = [
      'zone', 
      'alley', 
      'position', 
      'lvl', 
      'lvl_position'
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
    
    const newLocation = `${data.zone}-${data.alley}-${data.position}-${data.lvl}-${data.lvl_position}`;
    
    const checkIfEntreeExists = await this.datamapper.findBySpecificField("location", newLocation);

    if (!checkIfEntreeExists) {

      const updatedItem = await this.datamapper.update(data);
      res.status(200).send(updatedItem);

    } else {
      throw new BadRequestError(`Location ${newLocation} already exists.`);
    }
  }
}