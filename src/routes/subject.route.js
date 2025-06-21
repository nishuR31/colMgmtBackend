import express from "express";
import subjectRouter from "../routers/subject.router.js";
let subjectRoute = express.Router();
subjectRoute.use("/subject", subjectRouter);
export default subjectRoute;
