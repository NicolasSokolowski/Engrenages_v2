import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.middleware";
import { checkPermissions } from "../../../middlewares/checkPermissions.middleware";
import { locationBlockageController } from "../../../controllers/index.controllers";
import { validateRequest } from "../../../middlewares/validateRequest.middleware";
import { locationBlockageCreateSchema } from "../../../validation/index.validation";
import specificLocationBlockageRouter from "./specificLocationBlockageRouter";

const locationBlockageRouter = express.Router();

locationBlockageRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationBlockageController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", locationBlockageCreateSchema),
    errorCatcher(locationBlockageController.create)
  );

locationBlockageRouter.use("/:id", specificLocationBlockageRouter);

export default locationBlockageRouter;