import {
  BuildingManagerModel,
  IBuildingManager,
} from "@/models/building-manager-model";
import { Request, Response } from "express";
import { errResponse } from "./error-controller";
import bcrypt from "bcrypt";

export const buildingManagerSignUp = async (req: Request, res: Response) => {
  try {
    // 1 : take data out of body
    const bodyData = req.body;

    // 2 : encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(bodyData?.password, salt);

    // 3 : prepare the correct format
    const dataToStore = { ...bodyData, password: hashedPassword };

    //4 : create a user in DB
    const buildingManager: IBuildingManager = await BuildingManagerModel.create(
      dataToStore
    );

    // 5 : send success response
    res.status(200).json({
      status: "success",
      message: "Building manger sign up success",
      buildingManager,
    });
  } catch (err: unknown) {
    errResponse(res, err);
  }
};
