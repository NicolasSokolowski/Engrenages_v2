import { CoreController } from "./CoreController";
import { EntityControllerReq } from "./interfaces/EntityControllerReq";
import { AuthController } from "./auth/AuthController";
import { roleDatamapper, userDatamapper } from "../datamappers/index.datamappers";
import { UserController } from "./auth/UserController";
import { RoleController } from "./auth/RoleController";

const authController = new AuthController(userDatamapper);
const userController = new UserController(userDatamapper);
const roleController = new RoleController(roleDatamapper)

export {
  CoreController,
  EntityControllerReq,
  authController,
  userController,
  roleController
}