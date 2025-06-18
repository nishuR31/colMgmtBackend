import ApiErrorResponse from "../utils/ApiErrorResponse";
import ApiResponse from "../utils/ApiResponse";
import AsyncHandler from "../utils/AsyncHandler";
import Complaint from "../models/complaint.model.js";

export let raiseComplaint = AsyncHandler(async (req, res) => {
  let type = req?.query?.type;
  if (!type || type.length === 0) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "no type provided" }).res());
  }
  if (type.toLowerCase() !== "raise") {
    return res.status(400).json(
      ApiErrorResponse({
        message: "Invalid complaining query",
        type: type,
      }).res()
    );
  }
  let { by, message } = req?.body;
  if ([by, message].some((field) => field.length === 0)) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "fields were missing" }).res());
  }
  let complaint = await Complaint.create({ by: by, message: message });
  if (!complaint) {
    return res
      .status(500)
      .json(
        ApiErrorResponse(
          { message: "Something wrong with filing complaint" },
          500
        ).res()
      );
  }
  let payload = {
    _id: complaint._id,
    by: complaint.by,
    status: complaint.status,
  };
  req.payload = payload;
  return res.status(202).json(
    ApiResponse({
      message: "Complaint filed successfully",
      complaint: { message: complaint.message, by: message.by },
    }).res()
  );
});

export let replyComplaint = AsyncHandler(async (req, res) => {
  let type = req?.query?.type;
  let id = req?.params?.id;
  if ([type, id].some((field) => field.length === 0)) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "fields were missing" }).res());
  }
  if (type.toLowerCase() !== "reply") {
    return res.status(400).json(
      ApiErrorResponse({
        message: "Invalid complaining type",
        type: type,
      }).res()
    );
  }
  let complaint = await Complaint?.findById(id);
  if (!complaint) {
    return res
      .status(404)
      .json(ApiErrorResponse({ message: "Complaint not found" }).res());
  }

  let { response, status, respondedBy } = req?.body;
  if ([respondedBy, response, status].some((field) => field.length === 0)) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "fields were missing" }).res());
  }
  let repliedComplaint = await Complaint?.findByIdAndUpdate(
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
      complaint: {
        response: complaint.response,
        respondedBy: complaint.respondedBy,
        status: complaint.status,
      },
    }).res()
  );
});
