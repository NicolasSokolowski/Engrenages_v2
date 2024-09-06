import { CoreDatamapper } from "./CoreDatamapper";
import { RoleDatamapper } from "./auth/RoleDatamapper";
import { UserDatamapper } from "./auth/UserDatamapper";
import { EntityDatamapperReq } from "./interfaces/EntityDatamapperReq";
import { UserDatamapperReq } from "./interfaces/auth/UserDatamapperReq";
import { RoleDatamapperReq } from "./interfaces/auth/RoleDatamapperReq";
import { LocationTypeDatamapper } from "./structure/LocationTypeDatamapper";
import { LocationBlockageDatamapper } from "./structure/LocationBlockageDatamapper";
import { LocationDatamapper } from "./structure/LocationDatamapper";
import { ProductBlockageDatamapper } from "./product/ProductBlockageDatamapper";
import { ProductDatamapper } from "./product/ProductDatamapper";

const userDatamapper = new UserDatamapper();
const roleDatamapper = new RoleDatamapper();
const locationTypeDatamapper = new LocationTypeDatamapper();
const locationBlockageDatamapper = new LocationBlockageDatamapper();
const locationDatamapper = new LocationDatamapper();
const productBlockageDatamapper = new ProductBlockageDatamapper();
const productDatamapper = new ProductDatamapper();

export {
  CoreDatamapper,
  EntityDatamapperReq,
  UserDatamapperReq,
  userDatamapper,
  RoleDatamapperReq,
  roleDatamapper,
  LocationTypeDatamapper,
  locationTypeDatamapper,
  LocationBlockageDatamapper,
  locationBlockageDatamapper,
  LocationDatamapper,
  locationDatamapper,
  ProductBlockageDatamapper,
  productBlockageDatamapper,
  ProductDatamapper,
  productDatamapper
}