import express from "express";

import {
  facSignup,
  facDel,
  facSignin,
  facToken,
  facUser,
  facEdit,
} from "../controllers/faculty.controller.js";

let facultyRouter = express.Router();

facultyRouter.post("/signup", facSignup);
facultyRouter.post("/signin", facSignin);
facultyRouter.post("/del/:id", facDel);
facultyRouter.get("/:username", facUser);
facultyRouter.get("/:username/edit", facEdit); //?edit=true
facultyRouter.post("/:username/token", facToken); //

export default facultyRouter;
