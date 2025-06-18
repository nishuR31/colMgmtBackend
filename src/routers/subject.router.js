import express from "express";
import { subEntry,subEdit } from "../controllers/subject.controller";
let SubjectRouter = express.Router();

SubjectRouter.post("/subject/:username", subEntry);
SubjectRouter.post("/subject/:username?edit=true", subEdit);

export default SubjectRouter;
