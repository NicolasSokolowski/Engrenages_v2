import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.middleware";
import { checkPermissions } from "../../../middlewares/checkPermissions.middleware";
import { userController } from "../../../controllers/index.controllers";
import { validateRequest } from "../../../middlewares/validateRequest.middleware";
import updatePasswordRouter from "./updatePasswordRouter";
import { userUpdateSchema } from "../../../validation/index.validation";

const specificUserRouter = express.Router({ mergeParams: true });


specificUserRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(userController.getByPk)
  )
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", userUpdateSchema),
    errorCatcher(userController.update)
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(userController.delete)
  );

specificUserRouter.use("/updatepassword", updatePasswordRouter);

export default specificUserRouter;