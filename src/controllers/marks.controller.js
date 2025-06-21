import Student from "../models/student.model.js";
import ApiErrorResponse from "../utils/apiErrorResponse.js";
import ApiResponse from "../utils/apiResponse.js";
import AsyncHandler from "../utils/asyncHandler.js";
import Marks from "../models/marks.model.js";

export let stuMarks = AsyncHandler(async (req, res) => {
  let data = req.body;
  let stu = req.params.username;

  let { username, marks, subject, semester } = data;
  if (
    [username, subject, user].some(
      (field) => !field?.trim() || !marks || !semester
    )
  ) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "Missing fields" }).res());
  }

  if (stu.toLowerCase().trim() !== username) {
    return res
      .status(400)
      .json(
        new ApiErrorResponse({ message: "student usernames dont match" }).res()
      );
  }

  let student = await Student.findOne({ username: stu });
  if (!student) {
    return res
      .status(404)
      .json(new ApiErrorResponse({ message: "student dont exist" }, 404).res());
  }

  let marksModel = await Marks.findOne({ username: username });
  if (marksModel) {
    return res
      .status(409)
      .json(
        new ApiErrorResponse({ message: "Marks already exists" }, 409).res()
      );
  }

  let newMarks = await Marks.create({ ...data });
  if (!newMarks) {
    return res
      .status(500)
      .json(
        new ApiErrorResponse({ message: "Marks creation failed" }, 500).res()
      );
  }

  student.marks.push(newMarks._id);
  await student.save();

  return res
    .status(202)
    .json(new ApiResponse({ message: "student marks added" }).res());
});

export let stuMarksEdit = AsyncHandler(async (req, res) => {
  let data = req.body;
  let stu = req.params.username;

  let { username, marks, subject, semester } = data;
  if (
    [username, subject, stu].some(
      (field) => !field?.trim() || !marks || !semester
    )
  ) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "Missing fields" }).res());
  }

  if (stu !== username) {
    return res
      .status(400)
      .json(
        new ApiErrorResponse({ message: "student usernames dont match" }).res()
      );
  }

  let student = await Student.findOne({ username: stu });
  if (!student) {
    return res
      .status(404)
      .json(new ApiErrorResponse({ message: "student dont exist" }, 404).res());
  }

  let marksModel = await Marks.findOneAndUpdate(
    { username: username },
    { ...data },
    { new: true, validateBeforeSave: false }
  );
  if (!marksModel) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "Marks updatation failed" }).res());
  }

  student.marks.push(marksModel._id);
  await student.save();

  return res.status(202).json(
    new ApiResponse({
      message: "marks updated ".toCapitalize(),
    }).res()
  );
});
