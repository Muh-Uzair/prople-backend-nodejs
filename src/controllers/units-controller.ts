import { Request, Response } from "express";

// FUNCTION
export const getAllUnits = (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
  });
};
