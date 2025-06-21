import express from "express";
import AdminRouter from "../routers/admin.router.js";
import ComplaintRouter from "../routers/complaint.router.js";
import FacultyRouter from "../routers/faculty.router.js";
import MarksRouter from "../routers/marks.router.js";
import StudentsRouter from "../routers/students.router.js";
import SubjectRouter from "../routers/subject.router.js";

let AllRoute = express.Router();
allRouter.use("/student", StudentsRouter);
allRouter.use("/faculty", FacultyRouter);
allRouter.use("/admin", AdminRouter);
allRouter.use("/complaint", ComplaintRouter);
allRouter.use("/student/marks", MarksRouter);
allRouter.use("/student/subject", SubjectRouter);

export default AllRoute;
