import ApiErrorResponse from "../utils/apiErrorResponse.js";
import ApiResponse from "../utils/apiResponse.js";
import AsyncHandler from "../utils/asyncHandler.js";
import Complaint from "../models/complaint.model.js";

export let raiseComplaint = AsyncHandler(async (req, res) => {
  let type = req?.query?.type;
  if (!type || [type].some((field) => !field?.trim())) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "no type provided" }).res());
  }
  if (type.toLowerCase().trim() !== "raise") {
    return res.status(400).json(
      new ApiErrorResponse({
        message: "Invalid complaining query",
        type: type,
      }).res()
    );
  }
  let { by, message } = req?.body;
  if ([by, message].some((field) => !field?.trim())) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "fields were missing" }).res());
  }
  let complaint = await Complaint.create({ by: by, message: message });
  if (!complaint) {
    return res
      .status(500)
      .json(
        new ApiErrorResponse(
          { message: "Something wrong with filing complaint" },
          500
        ).res()
      );
  }
  let payload = {
    _id: complaint._id,
    by: complaint.by,
  };
  req.payload = payload;
  return res.status(202).json(
    new ApiResponse({
      message: "Complaint filed successfully",
      complaint: { by: message.by },
    }).res()
  );
});

export let replyComplaint = AsyncHandler(async (req, res) => {
  let { type, id } = req.query;
  if ([type, id].some((field) => !field?.trim())) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "fields were missing" }).res());
  }

  let complaint = await Complaint.findById(id);
  if (!complaint) {
    return res
      .status(404)
      .json(new ApiErrorResponse({ message: "Complaint not found" }).res());
  }

  let { response, status, respondedBy } = req.body;
  if ([respondedBy, response, status].some((field) => field.length === 0)) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "fields were missing" }).res());
  }
  let repliedComplaint = await Complaint.findByIdAndUpdate(
    { _id: id },
    { response: response, status: status, respondedBy: respondedBy },
    { new: true, validatebeforeSave: false }
  );
  if (!repliedComplaint) {
    return res
      .status(500)
      .json(
        new ApiErrorResponse(
          { message: "Something wrong with replying to the complaint" },
          500
        ).res()
      );
  }
  return res.status(202).json(
    new ApiResponse({
      message: "Complaint replied successfully",
      complaint: {
        response: complaint.response,
        respondedBy: complaint.respondedBy,
        status: complaint.status,
      },
    }).res()
  );
});

export let editComplaint = AsyncHandler(async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  let { response, status, respondedBy, message } = data;
  if (
    [edit, respondedBy, response, message, status, id].some(
      (field) => !field?.trim()
    )
  ) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "fields were missing" }).res());
  }

  let updatedComplaint = await Complaint.findByIdAndUpdate(
    { _id: id },
    { ...data },
    { new: true, validatebeforeSave: false }
  );
  if (!updatedComplaint) {
    return res
      .status(403)
      .json(
        new ApiErrorResponse(
          { message: "Something wrong with replying to the complaint" },
          403
        ).res()
      );
  }
  return res.status(202).json(
    new ApiResponse({
      message: "Complaint updated successfully",
    }).res()
  );
});
