import express from "express";

import {
  facSignup,
  facDel,
  facSignin,
  facToken,
  facUser,
  facEdit,
} from "../controllers/faculty,controller.js";

let FacultyRouter = express.Router();

FacultyRouter.post("/signup", facSignup);
FacultyRouter.post("/signin", facSignin);
FacultyRouter.post("/del/:id", facDel);
FacultyRouter.get("/:username", facUser);
FacultyRouter.get("/:username?edit=true", facEdit);
FacultyRouter.post("/:username/token", facToken); //

export default FacultyRouter;
