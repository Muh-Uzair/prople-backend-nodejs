import { BuildingManagerModel } from "@/models/building-manager-model";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { AppError } from "@/utils/AppError";
import { IBuildingManager } from "@/types/building-manager-types";

// FUNCTION
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
      data: { buildingManager },
    });
  } catch (err: unknown) {
    return next(err);
  }
};

// FUNCTION
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

// FUNCTION
export const buildingManagerSignout = (req: Request, res: Response) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

//FUNCTION
export const buildingManagerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1 : check the username and password
    const { username, password } = req.body;

    if (!username || !password) {
      return next(new AppError("Username or password missing", 400));
    }

    // 2 : check wether the user exists against that username
    const buildingManager = await BuildingManagerModel.findOne({
      username,
    }).select("+password");

    // 3 : compare the password
    const passwordCorrect = buildingManager?.password
      ? await bcrypt.compare(password, buildingManager?.password)
      : false;

    // 4 : check both buildManager and passwords are correct or not
    if (!buildingManager || !passwordCorrect) {
      return next(new AppError("Wrong username or password", 401));
    }

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

// FUNCTION
export const createBuildingManagerUsingGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const email = req.body.email;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ status: "fail", message: "Invalid email" });
    }

    let buildingManager = await BuildingManagerModel.findOne({ email });

    if (!buildingManager) {
      const username = `manager@${email.split("@")[0]}`;
      buildingManager = await BuildingManagerModel.create({ email, username });
    }

    // Don't set JWT cookie, just return the user data
    return res.status(200).json({
      status: "success",
      data: { buildingManager },
    });
  } catch (err) {
    return next(err);
  }
};

// FUNCTION
export const getBuildingManagerByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // 1 : take email out
    const email = req.body.email;

    if (!email) {
      return next(new AppError("Email not provided", 400));
    }

    // 2 : check building manager against that email
    const buildingManager: IBuildingManager | null =
      await BuildingManagerModel.findOne({ email });

    // 3 : check if building manager does not exists
    if (!buildingManager) {
      return next(
        new AppError("Building manager does not exists for provided email", 401)
      );
    }

    // 4 : building manager exists
    return res.status(200).json({
      status: "success",
      data: { buildingManager },
    });
  } catch (err) {
    return next(err);
  }
};
