import express from "express";
import marksRouter from "../routers/marks.router.js";
let marksRoute = express.Router();
marksRoute.use("/marks", marksRouter);
export default marksRoute;
