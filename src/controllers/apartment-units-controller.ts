import { Request, Response, NextFunction } from "express";

// FUNCTION
export const getAllApartmentUnits = (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
  });
};
