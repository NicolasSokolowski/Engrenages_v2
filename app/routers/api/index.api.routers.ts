import express from "express";
import authRouter from "./auth/authRouter";
import userRouter from "./auth/userRouter";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);

export default apiRouter;