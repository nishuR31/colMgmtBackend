import mongoose from "mongoose";
import RequireField from "../utils/requireField.js";
import { status } from "../constants.js";

let comlaintSchema = new mongoose.Schema(
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

let Complaint = mongoose.model("Complaint", comlaintSchema);
export default Complaint;
