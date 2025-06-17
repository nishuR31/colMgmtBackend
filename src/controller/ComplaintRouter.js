import express from "express";
import AsyncHandler from "../utils/AsyncHandler";
import ComplaintModel from "../models/Complaint.model";
import ApiErrorResponse from "../utils/ApiErrorResponse";
import ApiResponse from "../utils/ApiResponse";

let ComplaintRouter = express.Router();
ComplaintRouter.post(
  "/complaint?type=raise",
  AsyncHandler(async (req, res) => {
    let type = req.query.type;
    if (type.toLowerCase() !== "raise") {
      return res.status(400).json(
        ApiErrorResponse({
          message: "Invalid complaining query",
          type: type,
        }).res()
      );
    }
    let { by, message } = req.body;
    let complaint = await ComplaintModel.create({ by: by, message: message });
    if (!complaint) {
      return res
        .status(403)
        .json(
          ApiErrorResponse(
            { message: "Something wrong with filing complaint" },
            403
          ).res()
        );
    }
    let payloads = complaint.toObject();
    let payload = {
      _id: payloads._id,
      by: payloads.by,
      status: payloads.status,
    };
    req.payload = payload;
    return res.status(202).json(
      ApiResponse({
        message: "Complaint filed successfully",
        complaint: payload,
      }).res()
    );
  })
);

ComplaintRouter.post(
  "/complaint/:id?type=reply",
  AsyncHandler(async (req, res) => {
    let type = req.query.type;
    let id = req.params.id;
    if (type.toLowerCase() !== "reply") {
      return res.status(400).json(
        ApiErrorResponse({
          message: "Invalid complaining type",
          type: type,
        }).res()
      );
    }
    let complaint = await ComplaintModel.findById(id);
    if (!complaint) {
      return res
        .status(404)
        .json(ApiErrorResponse({ message: "Complaint not found" }).res());
    }

    let { response, status, respondedBy } = req.body;
    let repliedComplaint = await ComplaintModel.findByIdAndUpdate(
      { _id: id },
      { response: response, status: status, respondedBy: respondedBy }
    );
    if (!repliedComplaint) {
      return res
        .status(403)
        .json(
          ApiErrorResponse(
            { message: "Something wrong with replying to the complaint" },
            403
          ).res()
        );
    }
    return res.status(202).json(
      ApiResponse({
        message: "Complaint replied successfully",
        complaint: complaint,
      }).res()
    );
  })
);
