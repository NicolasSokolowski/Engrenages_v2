import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.middleware";
import { checkPermissions } from "../../../middlewares/checkPermissions.middleware";
import { validateRequest } from "../../../middlewares/validateRequest.middleware";
import { userController } from "../../../controllers/index.controllers";
import { passwordUpdateSchema } from "../../../validation/index.validation";


const updatePasswordRouter = express.Router({ mergeParams: true });

updatePasswordRouter.route("/")
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["operator", "admin"])),
    validateRequest("body", passwordUpdateSchema),
    errorCatcher(userController.updatePassword)
  );

export default updatePasswordRouter;