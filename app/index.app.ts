import express, { json } from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import router from "./routers/index.routers";

const app = express();

app.use(json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(errorHandler);

export { app };