import { CoreController } from "../CoreController";
import { RoleControllerReq } from "../interfaces/auth/RoleControllerReq";
import { RoleDatamapperReq } from "../../datamappers/index.datamappers";
import { userController } from "../index.controllers";
import { BadRequestError } from "../../errors/BadRequestError.error";

export class RoleController extends CoreController<RoleControllerReq, RoleDatamapperReq> {
  constructor(datamapper: RoleControllerReq["datamapper"]) {
    const field = "name";
    super(datamapper, field);

    this.datamapper = datamapper;
  }

  preDeletionCheck = async (field: string, value:any): Promise<void> => {
    const checkIfUsed = await userController.datamapper.findBySpecificField("role_name", value[field]);

    if (checkIfUsed) {
      throw new BadRequestError("Item still in use.")
    }
  }
}