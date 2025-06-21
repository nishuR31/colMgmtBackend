import mongoose from "mongoose";
import RequireField from "../utils/requireField.js";

const marksSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, RequireField("Username")],
      trim: true,
    },
    marks: {
      type: Number,
      required: [true, RequireField("Marks")],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    semester: {
      type: Number,
      required: [true, RequireField("Semester")],
      min: 1,
      max: 8,
    },
  },
  { timestamps: true }
);

let Marks = mongoose.model("Marks", marksSchema);
export default Marks;
