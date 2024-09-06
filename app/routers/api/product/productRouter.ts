import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth, checkPermissions, validateRequest} from "../../../middlewares/index.middlewares";
import { productCreateSchema } from "../../../validation/index.validation";
import specificProductRouter from "./specificProductRouter";
import { productController } from "../../../controllers/index.controllers";
import productBlockageRouter from "./productBlockageRouter";

const productRouter = express.Router();

productRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(productController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", productCreateSchema),
    errorCatcher(productController.create)
  );

productRouter.use("/blockage", productBlockageRouter);
productRouter.use("/:id", specificProductRouter);

export default productRouter;