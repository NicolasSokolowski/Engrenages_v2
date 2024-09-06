import express from "express";
import { errorCatcher } from "../../../helpers/index.helpers";
import { checkPermissions, requireAuth, validateRequest } from "../../../middlewares/index.middlewares";
import { productUpdateSchema } from "../../../validation/index.validation";
import { productController } from "../../../controllers/index.controllers";

const specificProductRouter = express.Router({ mergeParams: true });

specificProductRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(productController.getByPk)
  )
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", productUpdateSchema),
    errorCatcher(productController.update)
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(productController.delete)
  );

export default specificProductRouter;