import { Request, Response } from "express";
import { CoreController } from "../CoreController";
import { LocationControllerReq } from "../interfaces/structure/LocationControllerReq";
import { LocationDatamapperReq } from "../../datamappers/interfaces/structure/LocationDatamapperReq";
import { BadRequestError } from "../../errors/BadRequestError.error";
import { NotFoundError } from "../../errors/NotFoundError.error";

export class LocationController extends CoreController<LocationControllerReq, LocationDatamapperReq> {
  constructor(datamapper: LocationControllerReq["datamapper"]) {
    const field = "";
    super(datamapper, field);
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

    const bodyLocationCheck = updateFields.some((field) => data[field] !== undefined);

    if (bodyLocationCheck) {
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

    } else {

      data = {
        ...data,
        id
      }

      const updatedItem = await this.datamapper.update(data);
      res.status(200).send(updatedItem);
    }
    
  }

  preDeletionCheck = async (field: string, value:any): Promise<void> => {
    const checkIfUsed = await this.datamapper.checkIfNotNull("product_reference", value.id);

    if (checkIfUsed.length !== 0) {
      throw new BadRequestError("Location is currenty occupied by a reference.")
    }
  }
}