import express from "express";

let ComplaintRouter = express.Router();
ComplaintRouter.post("/complaint?type=raise", raiseComplaint);

ComplaintRouter.post("/complaint/:id?type=reply", replyComplaint);
