import express from "express";
import { userController } from "../../../controllers/index.controllers";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.middleware";
import { checkPermissions } from "../../../middlewares/checkPermissions.middleware";
import { validateRequest } from "../../../middlewares/validateRequest.middleware";
import roleRouter from "./roleRouter";
import specificUserRouter from "./specificUserRouter";
import { userCreateSchema } from "../../../validation/index.validation";

const userRouter = express.Router();

userRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["operator", "admin"])),
    errorCatcher(userController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", userCreateSchema),
    errorCatcher(userController.createUser)
  );

userRouter.use("/role", roleRouter);
userRouter.use("/:id", specificUserRouter);

export default userRouter;