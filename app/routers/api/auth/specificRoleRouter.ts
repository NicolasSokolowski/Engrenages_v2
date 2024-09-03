import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.middleware";
import { checkPermissions } from "../../../middlewares/checkPermissions.middleware";
import { roleController } from "../../../controllers/index.controllers";
import { validateRequest } from "../../../middlewares/validateRequest.middleware";
import { roleUpdateSchema } from "../../../validation/index.validation";


const specificRoleRouter = express.Router({ mergeParams: true});

specificRoleRouter.use(errorCatcher(requireAuth));
specificRoleRouter.use(errorCatcher(checkPermissions(["admin"])));

specificRoleRouter.route("/")
  .get(
    errorCatcher(roleController.getByPk)
  )
  .patch(
    validateRequest("body", roleUpdateSchema),
    errorCatcher(roleController.update)
  )
  .delete(
    errorCatcher(roleController.delete)
  );

export default specificRoleRouter;