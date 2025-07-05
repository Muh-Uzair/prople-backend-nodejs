import { Response } from "express";

export const errResponse = (res: Response, err: unknown): Response => {
  if (err instanceof Error) {
    // handling duplicate fields
    if ((err as any).code === 11000) {
      // 1 : finding which fields are duplicate
      const errArr = Object.keys((err as any)?.keyPattern);

      // 2 : preparing a message
      const message = `Duplicate fields not allowed ${errArr.join(", ")}`;

      // 3 : sending a response
      return res.status(500).json({
        status: "fail",
        message,
      });
    }

    // handling other errors
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  } else {
    return res.status(500).json({
      status: "fail",
      message: "An unexpected error has occurred",
    });
  }
};
