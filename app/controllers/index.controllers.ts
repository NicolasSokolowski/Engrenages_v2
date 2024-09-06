import { CoreController } from "./CoreController";
import { EntityControllerReq } from "./interfaces/EntityControllerReq";
import { AuthController } from "./auth/AuthController";
import { locationBlockageDatamapper, locationDatamapper, locationTypeDatamapper, productBlockageDatamapper, productDatamapper, roleDatamapper, userDatamapper } from "../datamappers/index.datamappers";
import { UserController } from "./auth/UserController";
import { RoleController } from "./auth/RoleController";
import { LocationTypeController } from "./structure/LocationTypeController";
import { LocationBlockageController } from "./structure/LocationBlockageController";
import { LocationController } from "./structure/LocationController";
import { ProductBlockageController } from "./product/ProductBlockageController";
import { ProductController } from "./product/ProductController";

const authController = new AuthController(userDatamapper);
const userController = new UserController(userDatamapper);
const roleController = new RoleController(roleDatamapper)
const locationTypeController = new LocationTypeController(locationTypeDatamapper);
const locationBlockageController = new LocationBlockageController(locationBlockageDatamapper);
const locationController = new LocationController(locationDatamapper);
const productBlockageController = new ProductBlockageController(productBlockageDatamapper);
const productController = new ProductController(productDatamapper);

export {
  CoreController,
  EntityControllerReq,
  authController,
  userController,
  roleController,
  locationTypeController,
  locationBlockageController,
  locationController,
  productBlockageController,
  productController
}