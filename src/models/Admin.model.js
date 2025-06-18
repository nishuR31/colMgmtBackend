import mongoose from "mongoose";
import RequireField from "../utils/RequireField.js";
import { admin, password, salt } from "../Constants.js";
import bcryptjs from "bcryptjs";
import validator from "validator";

const AdminSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, RequireField("number")],
      validate: {
        validator: function (phone) {
          return validator.isMobilePhone(phone, "en-IN");
        },
        message: "Invalid number format",
      },
    },
    email: {
      type: String,
      required: [true, RequireField("email")],
      trim: true,
      unique: true,
      validate: {
        validator: function (mail) {
          return validator.isEmail(mail);
        },
        message: "Invalid email format",
      },
    },
    username: {
      type: String,
      required: [true, RequireField("username")],
      unique: true,
      default: admin,
      trim: true,
    },
    password: {
      type: String,
      required: [true, RequireField("password")],
      trim: true,
      default: password,
      select: false,
    },
    role: {
      type: String,
      required: [true, RequireField("role")],
      enum: { values: ["admin"], message: "Invalid role" },
    },
  },
  { timestamps: true }
);

AdminSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcryptjs.hash(this.password, salt);

    next();
  } catch (err) {
    let error = new ApiErrorResponse(err).res();
    console.log(error);
    next(err);
  }
});

AdminSchema.pre("findOneAndUpdate", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcryptjs.hash(this.password, salt);

    next();
  } catch (err) {
    let error = new ApiErrorResponse(err).res();
    console.log(error);
    next(err);
  }
});

AdminSchema.methods.comparePassword = async function (password) {
  try {
    let isMatch = await bcryptjs.compare(password, this.password);
    if (!isMatch) {
      throw new Error("Passwords don't match");
    }
    return true;
  } catch (err) {
    let error = new ApiErrorResponse(err).res();
    console.log(error);
    return false;
  }
};

export default mongoose.model("Admin", AdminSchema);
