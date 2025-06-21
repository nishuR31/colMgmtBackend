import Student from "../models/student.model.js";
import Subject from "../models/subject.model.js";
import ApiErrorResponse from "../utils/apiErrorResponse.js";
import ApiResponse from "../utils/apiResponse.js";
import AsyncHandler from "../utils/asyncHandler.js";

export let subEntry = AsyncHandler(async (req, res) => {
  const data = req.body;
  const username = req.params.username;
  const { code, name, department, credit, semester } = data;

  if (
    [code, name, department, username].some((field) => !field?.trim()) ||
    credit == null ||
    semester == null ||
    credit < 1 ||
    credit > 5 ||
    semester < 1 ||
    semester > 8
  ) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "Some fields are missing" }).res());
  }

  const existingSubject = await Subject.findOne({
    username,
    $or: [{ code }, { name }],
  });

  if (existingSubject) {
    return res.status(409).json(
      // 409 = conflict
      new ApiErrorResponse({
        message: "Subject already exists",
        code: code,
      }).res()
    );
  }

  const newSubject = await Subject.create(data);
  if (!newSubject) {
    return res
      .status(500)
      .json(new ApiErrorResponse({ message: "Error saving subject" }).res());
  }
  let student = await Student.findOne({ username: username });
  if (!student) {
    return res
      .status(404)
      .json(new ApiErrorResponse({ message: "Student dont exist" }).res());
  }

  student.subjects.push(newSubject._id);
  await student.save(); // must persist it

  return res.status(201).json(
    new ApiResponse({
      message: "Subject created successfully",
      code: newSubject.code,
      name: newSubject.name,
      username,
    }).res()
  );
});

export let subEdit = AsyncHandler(async (req, res) => {
  const data = req.body;
  const username = req.params.username;

  const { code, name, department, credit, semester } = data;

  if (
    [code, edit, name, department, username].some((f) => !f?.trim()) ||
    credit == null ||
    semester == null ||
    credit < 1 ||
    credit > 5 ||
    semester < 1 ||
    semester > 8
  ) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "Some fields are missing" }).res());
  }

  const updatedSubject = await Subject.findOneAndUpdate(
    { username: username, code: code },
    { ...data },
    { validateBeforeSave: false, new: true }
  );

  if (!updatedSubject) {
    return res
      .status(404)
      .json(
        new ApiErrorResponse({ message: "Subject editing failed" }, 404).res()
      );
  }

  let student = await Student.findOne({ username: username });
  if (!student) {
    return res
      .status(404)
      .json(new ApiErrorResponse({ message: "Student dont exist" }).res());
  }

  student.subjects.push(updatedSubject._id);
  await student.save(); // must persist it

  return res.status(200).json(
    new ApiResponse({
      message: "Subject updated successfully",
      code: updatedSubject.code,
      name: updatedSubject.name,
      username: updatedSubject.username,
    }).res()
  );
});
