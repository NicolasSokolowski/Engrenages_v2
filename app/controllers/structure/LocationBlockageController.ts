import { LocationBlockageDatamapperReq } from "../../datamappers/interfaces/structure/LocationBlockageDatamapperReq";
import { BadRequestError } from "../../errors/BadRequestError.error";
import { CoreController } from "../CoreController";
import { locationController } from "../index.controllers";
import { LocationBlockageControllerReq } from "../interfaces/structure/LocationBlockageControllerReq";

export class LocationBlockageController extends CoreController<LocationBlockageControllerReq, LocationBlockageDatamapperReq> {
  constructor(datamapper: LocationBlockageControllerReq["datamapper"]) {
    const field = "name";
    super(datamapper, field);
    this.datamapper = datamapper;
  }

  preDeletionCheck = async (field: string, value:any): Promise<void> => {
    const checkIfUsed = await locationController.datamapper.findBySpecificField("location_blockage_name", value[field]);

    if (checkIfUsed) {
      throw new BadRequestError("Item still in use.")
    }
  }
}