import express from "express";
import authRouter from "./auth/authRouter";
import userRouter from "./auth/userRouter";
import locationRouter from "./structure/locationRouter";
import productRouter from "./product/productRouter";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/location", locationRouter);
apiRouter.use("/product", productRouter);

export default apiRouter;