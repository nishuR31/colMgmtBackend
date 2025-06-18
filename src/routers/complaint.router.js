import express from "express";
import {
  raiseComplaint,
  replyComplaint,
  editComplaint,
} from "./complaint.router";

let ComplaintRouter = express.Router();
ComplaintRouter.post("/complaint?type=raise", raiseComplaint);
ComplaintRouter.post("/complaint/:id?type=reply", replyComplaint);
ComplaintRouter.post("/complaint/:id?edit=true", editComplaint);
