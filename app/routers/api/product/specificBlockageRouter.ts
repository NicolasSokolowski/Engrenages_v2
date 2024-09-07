import express from "express";
import { errorCatcher } from "../../../helpers/index.helpers";
import { checkPermissions, requireAuth, validateRequest } from "../../../middlewares/index.middlewares";
import { productBlockageController } from "../../../controllers/index.controllers";
import { productBlockageUpdateSchema } from "../../../validation/index.validation";

const specificBlockageRouter = express.Router({ mergeParams: true });

specificBlockageRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(productBlockageController.getByPk)
  )
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", productBlockageUpdateSchema),
    errorCatcher(productBlockageController.update)
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(productBlockageController.delete)
  );

export default specificBlockageRouter;