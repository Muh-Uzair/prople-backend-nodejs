import { Document, Types } from "mongoose";

export interface IBuildingManager extends Document {
  name?: string;
  username?: string;
  email?: string;
  password: string;
  phone?: string;
  avatar?: string;
  associatedBuildings?: Types.ObjectId[];
  role: "buildingManager";
}
