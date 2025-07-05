import { Schema, Document, model, Types } from "mongoose";
import validator from "validator";

// 1. TypeScript interface for the document
export interface IBuildingManager extends Document {
  name?: string;
  username?: string;
  email?: string;
  password: string;
  phone?: string;
  avatar?: string;
  associatedBuildings?: Types.ObjectId[];
}

// 2. Mongoose Schema
const buildingManagerSchema = new Schema<IBuildingManager>(
  {
    name: {
      type: String,
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^manager@.+/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid username. It must start with 'manager@'`,
      },
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: (val: string) =>
          validator.isEmail(val, {
            allow_utf8_local_part: false,
            require_tld: true,
            allow_ip_domain: false,
          }),
        message: "Invalid email address format",
      },
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      validate: {
        validator: (val: string) =>
          validator.isStrongPassword(val, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          }),
        message:
          "Password must include uppercase, lowercase, number, and special character",
      },
    },
    phone: {
      type: String,
      validate: {
        validator: (val: string) => validator.isMobilePhone(val, "any"),
        message: "Invalid phone number",
      },
    },
    avatar: {
      type: String,
      validate: {
        validator: (val: string) => validator.isURL(val),
        message: "Avatar must be a valid URL",
      },
    },
    associatedBuildings: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

buildingManagerSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

// 3. Mongoose model with TS generic
export const BuildingManagerModel = model<IBuildingManager>(
  "BuildingManager",
  buildingManagerSchema
);
