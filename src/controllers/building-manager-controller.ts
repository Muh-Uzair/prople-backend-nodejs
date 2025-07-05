import {
  BuildingManagerModel,
  IBuildingManager,
} from "@/models/building-manager-model";
import { Request, Response } from "express";
import { errResponse } from "./error-controller";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

export const buildingManagerSignUp = async (req: Request, res: Response) => {
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

    // 5 : send success response
    res.status(200).json({
      status: "success",
      message: "Building manger sign up success",
      buildingManager,
      jwt: token,
    });
  } catch (err: unknown) {
    errResponse(res, err);
  }
};
