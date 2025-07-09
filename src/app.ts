/* eslint-disable */

import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import unitsRouter from "@/routes/units-routes";
import buildingManagerRouter from "@/routes/building-manager-routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./controllers/error-controller";

dotenv.config({ path: "./config.env" });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ROUTES
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "welcome to prople backend",
  });
});

app.use("/api/v1/units", unitsRouter);
app.use("/api/v1/building-manager", buildingManagerRouter);

// Handle unknown routes (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Cannot find ${req.originalUrl} on this server.`,
  });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  globalErrorHandler(err, req, res);
});

export default app;
