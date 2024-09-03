import { Request, Response } from "express";
import { CoreController } from "../CoreController";
import { RoleControllerReq } from "../interfaces/auth/RoleControllerReq";
import { RoleDatamapperReq } from "../../datamappers/index.datamappers";
import { BadRequestError } from "../../errors/BadRequestError.error";
import { NotFoundError } from "../../errors/NotFoundError.error";
import { DatabaseConnectionError } from "../../errors/DatabaseConnectionError.error";

export class RoleController extends CoreController<RoleControllerReq, RoleDatamapperReq> {
  constructor(datamapper: RoleControllerReq["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("This id doesn't exist");
    }

    let { name }: Partial<RoleDatamapperReq["data"]> = req.body;

    const roleToUpdate = await this.datamapper.findByPk(id);

    if (!roleToUpdate) {
      throw new NotFoundError();
    }

    name ? name : name = roleToUpdate.name;

    const newRoleData = { 
      ...roleToUpdate, 
      name
    };

    const updatedRole = await this.datamapper.update(newRoleData);

    if (!updatedRole) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(updatedRole);
  }
}