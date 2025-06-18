import express from "express";
import {
  stuSignup,
  stuToken,
  stuUser,
  stuDel,
  stuSignin,
  stuEdit,
} from "../controllers/student.controller.js";

let StudentRouter = express.Router();

StudentRouter.post("/signup", stuSignup);
StudentRouter.post("/signin", stuSignin);
StudentRouter.post("/del/:id", stuDel);
StudentRouter.get("/:username", stuUser);
StudentRouter.get("/:username?edit=true", stuEdit);
StudentRouter.post("/:username/token", stuToken);

export default StudentRouter;
