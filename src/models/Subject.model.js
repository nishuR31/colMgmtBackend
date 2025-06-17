import mongoose from "mongoose";
import { departments } from "../utils/constants.js";
import RequireField from "../utils/RequireField.js";

let SubjectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
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
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", SubjectSchema);
