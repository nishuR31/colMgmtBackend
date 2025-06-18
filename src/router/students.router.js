import express from "express";
import {
  stuSignup,
  stuToken,
  stuUser,
  stuDel,
  stuSignin,
} from "../controllers/student.controller.js";

let StudentRouter = express.Router();

StudentRouter.post("/signup", stuSignup);

StudentRouter.post("/del/:id", stuDel);

StudentRouter.post("/signin", stuSignin);

StudentRouter.get("/:username", stuUser);

StudentRouter.post("/:username/token", stuToken); //

export default StudentRouter;
