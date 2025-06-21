import express from "express";
import {
  adminSignup,
  adminDel,
  adminSignin,
  adminToken,
  adminUser,
  adminEdit,
} from "../controllers/admin.controller.js";

let adminRouter = express.Router();

adminRouter.post("/signup", adminSignup);
adminRouter.post("/signin", adminSignin);
adminRouter.get("/:username", adminUser);
adminRouter.get("/:username/edit", adminEdit); //?edit=true
adminRouter.get("/:username/token", adminToken);
adminRouter.post("/del/:id", adminDel);

export default adminRouter;
