import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.middleware";
import { checkPermissions } from "../../../middlewares/checkPermissions.middleware";
import { locationTypeController } from "../../../controllers/index.controllers";
import { validateRequest } from "../../../middlewares/validateRequest.middleware";
import { locationTypeUpdateSchema } from "../../../validation/index.validation";

const specificLocationTypeRouter = express.Router({ mergeParams: true });

specificLocationTypeRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationTypeController.getByPk)    
  )
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", locationTypeUpdateSchema),
    errorCatcher(locationTypeController.update)    
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationTypeController.delete)    
  );

export default specificLocationTypeRouter;