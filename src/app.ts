import express, { Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import apartmentUnitsRouter from "@/routes/apartment-units-routes";

dotenv.config({ path: "./config.env" });

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req: Request, res, Response) => {
  res.status(200).json({
    message: "Welcome to the Prople Backend API",
  });
});

app.get("/example", (req: Request, res, Response) => {
  res.status(200).json({
    message: "Welcome to the Prople Backend API example",
  });
});

app.use("/api/v1/apartment-units", apartmentUnitsRouter);

export default app;
