import express from "express";
import apiRouter from "./api/index.api.routers";
import { routeNotFound } from "../middlewares/routeNotFound.middleware";

const router = express.Router();

router.use("/api", apiRouter);
router.use(routeNotFound);

export default router;