import {
  BuildingManagerModel,
  IBuildingManager,
} from "@/models/building-manager-model";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { AppError } from "@/utils/AppError";

export const buildingManagerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1 : take data out of body
    const bodyData = req.body;

    // 2 : encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(bodyData?.password, salt);

    // 3 : prepare a dummy email
    const email =
      bodyData?.username?.length > 0
        ? `dummyEmail${bodyData?.username?.slice(8)}@example.com`
        : bodyData.email;

    // 4 : prepare the correct format
    const dataToStore = { ...bodyData, email, password: hashedPassword };

    // 5 : create a user in DB
    const buildingManager: IBuildingManager = await BuildingManagerModel.create(
      dataToStore
    );

    // 6 : sign a jwt, create a jwt
    const jwtSecret: string = process.env.JWT_SECRET!;
    const jwtExpiresIn: number =
      Number(process.env.JWT_EXPIRES_IN) || 259200000;

    const signOptions: SignOptions = {
      expiresIn: jwtExpiresIn,
    };

    const token = jwt.sign(
      { id: String(buildingManager._id) }, // always cast ObjectId to string
      jwtSecret,
      signOptions
    );

    // 7 : send the cookie
    res.cookie("jwt", token, {
      httpOnly: true, // prevents access from JavaScript (XSS protection)
      secure: process.env.NODE_ENV === "production", // only sent over HTTPS in production
      sameSite: "lax", // or "strict" / "none" depending on frontend/backend setup
      path: "/",
      maxAge: 3 * 24 * 60 * 60 * 1000, // in milliseconds
    });

    // 8 : send success response
    res.status(200).json({
      status: "success",
      message: "Building manger sign up success",
      data: { buildingManager },
    });
  } catch (err: unknown) {
    return next(err);
  }
};

export const getCurrBuildingManager = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1 : check that the received jwt is valid or not
    const token = req.cookies?.jwt;

    if (!token) {
      return next(new AppError("Token is missing", 401));
    }
    // 2 : take the building manager id out of it
    const jwtSecret = process.env.JWT_SECRET as string;
    if (!jwtSecret) {
      return next(new AppError("JWT secret is not defined", 500));
    }
    const decodedToken = jwt.verify(token, jwtSecret) as { id: string };

    // 3 : check the building manager against that id
    const buildingManagerId = decodedToken?.id;

    const buildingManager = await BuildingManagerModel.findById(
      buildingManagerId
    );

    if (!buildingManager) {
      return next(new AppError("Building manager not found", 404));
    }

    // 4 : if building manager is available than send that
    res.status(200).json({
      status: "success",
      data: {
        buildingManager,
      },
    });
  } catch (err: unknown) {
    return next(err);
  }
};
