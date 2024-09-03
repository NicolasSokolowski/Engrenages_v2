import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.middleware";
import { checkPermissions } from "../../../middlewares/checkPermissions.middleware";
import { validateRequest } from "../../../middlewares/validateRequest.middleware";
import { roleController } from "../../../controllers/index.controllers";
import specificRoleRouter from "./specificRoleRouter";
import { roleCreateSchema } from "../../../validation/index.validation";

const roleRouter = express.Router();

roleRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(roleController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", roleCreateSchema),
    errorCatcher(roleController.create)    
  );

roleRouter.use("/:id", specificRoleRouter);

export default roleRouter;