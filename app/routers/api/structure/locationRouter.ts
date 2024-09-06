import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.middleware";
import { checkPermissions } from "../../../middlewares/checkPermissions.middleware";
import { locationController } from "../../../controllers/index.controllers";
import { validateRequest } from "../../../middlewares/validateRequest.middleware";
import { locationCreateSchema } from "../../../validation/index.validation";
import locationTypeRouter from "./locationTypeRouter";
import locationBlockageRouter from "./locationBlockageRouter";
import specificLocationRouter from "./specificLocation.api.router";


const locationRouter = express.Router();

locationRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", locationCreateSchema),
    errorCatcher(locationController.create)    
  );

locationRouter.use("/type", locationTypeRouter);
locationRouter.use("/blockage", locationBlockageRouter);
locationRouter.use("/:id", specificLocationRouter);

export default locationRouter;
