import express from "express";
import adminRouter from "../routers/admin.router.js";
let adminRoute = express.Router();
adminRoute.use("/admin", adminRouter);
export default adminRoute;
