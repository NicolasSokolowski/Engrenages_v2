import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.middleware";
import { checkPermissions } from "../../../middlewares/checkPermissions.middleware";
import { locationTypeController } from "../../../controllers/index.controllers";
import { validateRequest } from "../../../middlewares/validateRequest.middleware";
import { locationTypeCreateSchema } from "../../../validation/index.validation";
import specificLocationTypeRouter from "./specificLocationTypeRouter";

const locationTypeRouter = express.Router();

locationTypeRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationTypeController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", locationTypeCreateSchema),
    errorCatcher(locationTypeController.create)    
  );

locationTypeRouter.use("/:id", specificLocationTypeRouter);

export default locationTypeRouter;