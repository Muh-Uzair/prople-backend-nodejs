import express, { Request, Response } from "express";

const app = express();

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

export default app;
