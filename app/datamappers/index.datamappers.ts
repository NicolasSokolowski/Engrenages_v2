import { CoreDatamapper } from "./CoreDatamapper";
import { RoleDatamapper } from "./auth/RoleDatamapper";
import { UserDatamapper } from "./auth/UserDatamapper";
import { EntityDatamapperReq } from "./interfaces/EntityDatamapperReq";
import { UserDatamapperReq } from "./interfaces/auth/UserDatamapperReq";
import { RoleDatamapperReq } from "./interfaces/auth/RoleDatamapperReq";

const userDatamapper = new UserDatamapper();
const roleDatamapper = new RoleDatamapper();

export {
  CoreDatamapper,
  EntityDatamapperReq,
  UserDatamapperReq,
  userDatamapper,
  RoleDatamapperReq,
  roleDatamapper
}