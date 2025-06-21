import express from "express";
import facultyRouter from "../routers/faculty.router.js";
let facultyRoute = express.Router();
facultyRoute.use("/faculty", facultyRouter);
export default facultyRoute;
