import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.middleware";
import { checkPermissions } from "../../../middlewares/checkPermissions.middleware";
import { locationBlockageController } from "../../../controllers/index.controllers";
import { validateRequest } from "../../../middlewares/validateRequest.middleware";
import { productBlockageUpdateSchema } from "../../../validation/index.validation";


const specificLocationBlockageRouter = express.Router({ mergeParams: true });

specificLocationBlockageRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationBlockageController.getByPk)
  )
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", productBlockageUpdateSchema),
    errorCatcher(locationBlockageController.update)
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationBlockageController.delete)
  );

export default specificLocationBlockageRouter;