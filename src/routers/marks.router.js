import express from "express";
import { stuMarks, stuMarksEdit } from "../controllers/marks.controller.js";

let marksRouter = express.Router();

marksRouter.post("/:username", stuMarks);
marksRouter.post("/:username/edit", stuMarksEdit); //?edit=true
export default marksRouter;
