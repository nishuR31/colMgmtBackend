import express from "express";
import {
  stuSignup,
  stuToken,
  stuUser,
  stuDel,
  stuSignin,
  stuEdit,
} from "../controllers/student.controller.js";

let studentRouter = express.Router();

studentRouter.post("/signup", stuSignup);
studentRouter.post("/signin", stuSignin);
studentRouter.post("/del/:id", stuDel);
studentRouter.get("/:username", stuUser);
studentRouter.get("/:username/edit", stuEdit); //?edit=true
studentRouter.post("/:username/token", stuToken);

export default studentRouter;
