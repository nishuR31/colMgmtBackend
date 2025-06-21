// App.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import ApiErrorResponse from "../utils/apiErrorResponse.js";
import Logger from "../utils/logger.js";
import studentRoute from "../routes/student.route.js";
import facultyRoute from "../routers/faculty.route.js";
import complaintRoute from "../routers/complaint.route.js";
import adminRoute from "../routers/admin.route.js";
import subjectRoute from "../routers/subject.route.js";

export default function App() {
  const app = express();
  const baseUri = process.env.BASEURI || "/api/v1";

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());
  app.use(cookieParser());
  app.use(Logger);

  app.use(baseUri + "/student", studentRoute);
  app.use(baseUri + "/faculty", facultyRoute);
  app.use(baseUri + "/complaint", complaintRoute);
  app.use(baseUri + "/marks", marksRoute);
  app.use(baseUri + "/admin", adminRoute);
  app.use(baseUri + "/subject", subjectRoute);

  app.get("/", (req, res) => {
    res.send("Server running");
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
