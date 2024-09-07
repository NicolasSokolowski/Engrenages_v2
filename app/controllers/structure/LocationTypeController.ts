import { LocationTypeDatamapperReq } from "../../datamappers/interfaces/structure/LocationTypeDatamapperReq";
import { BadRequestError } from "../../errors/BadRequestError.error";
import { CoreController, locationController } from "../index.controllers";
import { LocationTypeControllerReq } from "../interfaces/structure/LocationTypeControllerReq";

export class LocationTypeController extends CoreController<LocationTypeControllerReq, LocationTypeDatamapperReq> {
  constructor(datamapper: LocationTypeControllerReq["datamapper"]) {
    const field = "name";
    super(datamapper, field);
    this.datamapper = datamapper;
  }

  preDeletionCheck = async (field: string, value:any): Promise<void> => {
    const checkIfUsed = await locationController.datamapper.findBySpecificField("location_type_name", value[field]);

    if (checkIfUsed) {
      throw new BadRequestError("Item still in use.")
    }
  }
}