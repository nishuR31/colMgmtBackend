import mongoose from "mongoose";
import { departments } from "../utils/constants.js";
import RequireField from "../utils/RequireField.js";

let SubjectSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, RequireField("Username of student")],
      unique: false,
      trim: true,
    },
    code: {
      type: String,
      required: [true, RequireField("Code of subject")],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, RequireField("Name of subject")],
      trim: true,
    },
    department: {
      type: String,
      required: [true, RequireField("department of subject")],
      trim: true,
      enum: {
        values: departments,
        message: "Invalid department",
      },
    },
    credits: { type: Number, min: 1, max: 5 },

    semester: {
      type: Number,
      min: 1,
      max: 8,
      required: [true, RequireField("semester")],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", SubjectSchema);
