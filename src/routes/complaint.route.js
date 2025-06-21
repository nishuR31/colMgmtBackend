import express from "express";
import complaintRouter from "../routers/complaint.router.js";
let complaintRoute = express.Router();
complaintRoute.use("/complaint", complaintRouter);
export default complaintRoute;
