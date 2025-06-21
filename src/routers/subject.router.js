import express from "express";
import { subEntry, subEdit } from "../controllers/subject.controller.js";
let subjectRouter = express.Router();

subjectRouter.post("/subject/:username", subEntry);
subjectRouter.post("/subject/:username/edit", subEdit); //?edit=true

export default subjectRouter;
