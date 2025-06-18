import express from "express";

import {
  facSignup,
  facDel,
  facSignin,
  facToken,
  facUser,
} from "../controllers/faculty,controller.js";

let FacultyRouter = express.Router();

FacultyRouter.post("/signup", facSignup);

FacultyRouter.post("/del/:id", facDel);

FacultyRouter.post("/signin", facSignin);

FacultyRouter.get("/:username", facUser);

FacultyRouter.post("/:username/token", facToken); //

export default FacultyRouter;
