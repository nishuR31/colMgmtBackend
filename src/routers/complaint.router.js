import express from "express";
import {
  raiseComplaint,
  replyComplaint,
  editComplaint,
} from "../controllers/complaint.controller.js";

let complaintRouter = express.Router();
complaintRouter.post("/complaint", raiseComplaint); //?type=raise
complaintRouter.post("/complaint/:id/reply", replyComplaint); //?type=reply
complaintRouter.post("/complaint/:id/edit", editComplaint); //?edit=true

export default complaintRouter;
