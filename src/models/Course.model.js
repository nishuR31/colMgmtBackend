import mongoose from "mongoose";

let CourseSchema = new mongoose.Schema(
  {
    subjects: {
      subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
