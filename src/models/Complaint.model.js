import mongoose from "mongoose";
import RequireField from "../utils/RequireField.js";
import { status } from "../Constants.js";

let ComlaintSchema = new mongoose.Schema(
  {
    by: {
      type: String,
      default: "Anonymous",
      trim: true,
    },
    message: {
      type: String,
      required: [true, RequireField("message of complaint")],
      trim: true,
    },
    status: {
      type: String,
      required: [true, RequireField("status")],
      enum: { values: status, message: "Invalid status" },
      default: "active",
    },
    response: {
      type: String,
      trim: true,
      default: "",
    },
    respondedBy: {
      type: String,
      required: [true, RequireField("name of responder")],
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", ComlaintSchema);
