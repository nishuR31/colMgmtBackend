// App.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import ApiErrorResponse from "../utils/apiErrorResponse.js";
import Logger from "../utils/logger.js";
import studentRoute from "../routes/student.route.js";
import facultyRoute from "../routes/faculty.route.js";
import marksRoute from "../routes/marks.route.js";
import complaintRoute from "../routes/complaint.route.js";
import adminRoute from "../routes/admin.route.js";
import subjectRoute from "../routes/subject.route.js";
import dotenv from "dotenv";
import helpRoutePage from "../helper/helpRoutePage.js";
import homePage from "../helper/homePage.js";
dotenv.config({ path: "../../.env", debug: true });

const port = process.env.PORT || 3000;

export default function App() {
  const app = express();
  const baseUri = process.env.BASEURI || "/api/v1";
  app.use(express.static("public")); // Serve public folder
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  // app.use(helmet());
  app.use(cookieParser());
  app.use(Logger);

  app.use(baseUri, studentRoute);
  app.use(baseUri, facultyRoute);
  app.use(baseUri, complaintRoute);
  app.use(baseUri + "/student", marksRoute);
  app.use(baseUri, adminRoute);
  app.use(baseUri + "/student", subjectRoute);

  let defaultRoute = `http://localhost:${port}`;

  app.get(baseUri, (req, res) => {
    res.send(homePage);
  });

  app.get("/help", (req, res) => {
    res.send(helpRoutePage);
  });

  app.get("/home", (req, res) => {
    res.send("Hehe");
  });

  // Global error handler (must come after all routes)
  app.use((err, req, res, next) => {
    let error = new ApiErrorResponse(err).res();
    console.log(error);
    res.status(error.statusCode || 500).json(error);
  });

  return app;
}
