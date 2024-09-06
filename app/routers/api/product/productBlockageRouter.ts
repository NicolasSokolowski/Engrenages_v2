import express from "express";
import { errorCatcher } from "../../../helpers/index.helpers";
import { productBlockageController } from "../../../controllers/index.controllers";
import { productBlockageCreateSchema } from "../../../validation/index.validation";
import { checkPermissions, requireAuth, validateRequest } from "../../../middlewares/index.middlewares";
import specificBlockageRouter from "./specificBlockageRouter";

const productBlockageRouter = express.Router();

productBlockageRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(productBlockageController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", productBlockageCreateSchema),
    errorCatcher(productBlockageController.create)
  );

productBlockageRouter.use("/:id", specificBlockageRouter);

export default productBlockageRouter;