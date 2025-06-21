import express from "express";
import studentRouter from "../routers/student.router.js";
let studentRoute = express.Router();
studentRoute.use("/student", studentRouter);
export default studentRoute;
