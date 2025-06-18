import express from "express";
import { stuMarks, stuMarksEdit } from "../controllers/marks.controller.js";

let MarksRouter = express.Router();

MarksRouter.post("/:username/marks", stuMarks);
MarksRouter.post("/:username/marks?edit=true", stuMarksEdit);
export default MarksRouter;
