import mongoose from "mongoose";
// At the top of your entry file (e.g., index.js)
import dotenv from "dotenv";
dotenv.config();
let altasUri = process.env.MONGODB_URI_ALTAS;
let localUri = process.env.MONGODB_URI_LOCAL;
export default async function connectDb() {
  try {
    let connection = await mongoose.connect(localUri);
    console.log(
      `MongoDB Connection established successfully:${connection.connection.host}`
    );
  } catch (err) {
    console.log(`Error connected to Mongodb:${err}`);
  }
}
