import mongoose from "mongoose";
import ApiErrorResponse from "../utils/ApiErrorResponse.js";

export async function connectDb() {
  try {
    let connection = await mongoose.connect(
      "mongodb://localhost:27017/collegeMgmt"
    );
    console.log(`MongoDB Connection established successfully`);
  } catch (err) {
    let error = new ApiErrorResponse(err).res();
    console.log(`Error connected to Mongodb:${error}`);
  }
}
