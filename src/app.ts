import express, { Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import unitsRouter from "@/routes/units-routes";

dotenv.config({ path: "./config.env" });

const app = express();

app.use(express.json());

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

// request to api that is not on server
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: "api not found",
  });
});

export default app;
