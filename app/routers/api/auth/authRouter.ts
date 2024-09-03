import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { authController } from "../../../controllers/index.controllers";

const authRouter = express.Router();

authRouter.route("/signin")
  .post(
    errorCatcher(authController.signin)
  );

export default authRouter;