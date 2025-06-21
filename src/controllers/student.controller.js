import Student from "../models/student.model.js";
import ApiErrorResponse from "../utils/apiErrorResponse.js";
import { verify, tokenGen } from "../utils/jwtTokens.js";
import { tokenSecret, generateTokenOptions } from "../constants.js";
import ApiResponse from "../utils/apiResponse.js";
import AsyncHandler from "../utils/asyncHandler.js";

export let stuSignup = AsyncHandler(async (req, res) => {
  const data = req.body;
  let {
    username,
    fullName,
    password,
    email,
    dob,
    phone,
    branch,
    role,
    program,
    bloodGroup,
    course,
    marks,
    gaurdianContactNum,
  } = data;
  if (
    [
      username,
      fullName,
      password,
      email,
      dob,
      phone,
      branch,
      role,
      program,
      bloodGroup,
      course,
      gaurdianContactNum,
    ].some((field) => !field?.trim())
  ) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "Missing fields" }).res());
  }

  let student = await Student.findOne({
    username,
    $or: [{ fullName }, { email }],
  });
  if (student) {
    return res
      .status(409)
      .json(
        new ApiErrorResponse({ message: "Student already exists" }, 409).res()
      );
  }
  const newStudent = await Student.create(data);
  if (!newStudent) {
    return res
      .status(500)
      .json(
        new ApiErrorResponse({ message: "Student creation failed" }, 500).res()
      );
  }
  return res.status(201).json(
    new ApiResponse({
      success: true,
      message: "Student created successfully",
      Student: { username: username, name: fullName },
    }).res()
  );
});

export let stuEdit = AsyncHandler(async (req, res) => {
  const data = req.body;
  let {
    username,
    fullName,
    password,
    email,
    dob,
    phone,
    branch,
    role,
    program,
    bloodGroup,
    course,
    marks,
    gaurdianContactNum,
  } = data;
  if (
    [
      username,
      fullName,
      password,
      email,
      dob,
      phone,
      branch,
      role,
      program,
      bloodGroup,
      course,
      gaurdianContactNum,
    ].some((field) => !field?.trim() || !marks)
  ) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "Missing fields" }).res());
  }

  let student = await Student.findOne({
    username,
    $or: [{ fullName }, { email }],
  });
  if (!student) {
    return res
      .status(404)
      .json(new ApiErrorResponse({ message: "Student dont exist" }, 404).res());
  }
  const newStudent = await Student.findOneAndUpdate(
    { username, $or: [{ email }] },
    { ...data },
    { new: true, validateBeforeSave: false }
  );
  if (!newStudent) {
    return res
      .status(500)
      .json(
        new ApiErrorResponse(
          { message: "Student updatation failed" },
          500
        ).res()
      );
  }
  return res.status(201).json(
    new ApiResponse({
      success: true,
      message: "Student updated successfully",
      Student: { username: username, name: fullName },
    }).res()
  );
});

export let stuUser = AsyncHandler(async (req, res) => {
  const username = req.params.username.toLowerCase().trim();
  if ([username].some((field) => !field?.trim())) {
    return res
      .status(404)
      .json(
        new ApiErrorResponse({ message: "fields were missing" }, 404).res()
      );
  }
  const student = await Student.findOne({ username });

  if (!student) {
    return res
      .status(404)
      .json(
        new ApiErrorResponse({ message: "Student not found" }, 404, false).res()
      );
    //   res.redirect("/Student/signup");
  }
  return res.status(200).json(
    new ApiResponse({
      success: true,
      message: "Student found",
      student: { username: student.username }, // You may want to filter out sensitive fields
    }).res()
  );
});

export let stuSignin = AsyncHandler(async (req, res) => {
  const { username, password, phone, email, role } = req.body;
  if (
    [username, password, email, phone, role].some((field) => !field?.trim())
  ) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "Missing fields" }).res());
  }

  const student = await Student.findOne({
    username,
    $or: [{ email }],
  });
  if (!student) {
    return res
      .status(404)
      .json(
        new ApiErrorResponse(
          { message: "invalid credentials" },
          404,
          false
        ).res()
      );
  }
  if (role.toLowerCase().trim() !== "student") {
    return res
      .status(406)
      .json(
        new ApiErrorResponse(
          { message: "Access denied: Not Student" },
          406,
          false
        ).res()
      );
  }
  let isMatch = await student.comparePassword(password);
  if (!isMatch) {
    return res
      .status(400)
      .json(
        new ApiErrorResponse(
          { message: "invalid credentials" },
          400,
          false
        ).res()
      );
  }
  let payload = {
    _id: student._id,
    username: student.username,
    email: student.email,
    role: student.role || "student",
  };
  req.student = payload;
  let { accessToken, refreshToken } = tokenGen(
    payload,
    tokenSecret,
    generateTokenOptions
  );
  student.refreshToken = refreshToken;
  await student.save({ validateBeforeSave: false });
  res.cookie("stuRefreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 15 * 7 * 24 * 60 * 60 * 1000, // 15 days
  });
  res.cookie("stuAccessoken", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 1 * 7 * 24 * 60 * 60 * 1000, // 15 days
  });
  return res
    .status(200)
    .json(new ApiResponse({ accessToken: accessToken }).res());
});

export let stuDel = AsyncHandler(async (req, res) => {
  let id = req.params.id;
  if ([id].some((field) => !field?.trim() || !id)) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "fields were missing" }).res());
  }
  if (req.student && req.student._id.toString() !== id) {
    return res
      .status(403)
      .json(
        new ApiErrorResponse(
          { message: "You cannot delete other student id" },
          403
        ).res()
      );
  }
  let student = await Student.findByIdAndDelete({ id });
  if (!student) {
    return res
      .status(200)
      .json(
        new ApiErrorResponse(
          { message: `Student can\'t be removed` },
          400
        ).res()
      );
  }
  return res
    .status(202)
    .json(
      new ApiResponse(
        { message: "Student successfully deleted", student: student.username },
        202
      ).res
    );
});

export let stuToken = AsyncHandler(async (req, res, next) => {
  // const authHeader = req.headers["authorization"];
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return res
  //     .status(401)
  //     .json(
  //       new ApiErrorResponse({ message: "Unauthorized: No token provided" }).res()
  //     );
  // }
  // const accessToken_ = authHeader.split(" ")[1];
  // if (!accessToken_ || accessToken_.length === 0) {
  //   return res
  //     .status(400)
  //     .json(new ApiErrorResponse({ message: "No access token found" }).res());
  // }
  // let decodedAccess;
  // try {
  //   decodedAccess = verify(
  //     accessToken_,
  //     tokenSecret.access,
  //     generateTokenOptions,
  //     "access"
  //   );
  // } catch (err) {
  //   return res
  //     .status(401)
  //     .json(new ApiErrorResponse({ message: "Access token invalid" }, 401).res());
  // }
  // if (String(decodedAccess._id) !== String(req.student._id)) {
  //   return res
  //     .status(400)
  //     .json(
  //       new ApiErrorResponse(
  //         { Message: "expired or invalid access token" },
  //         400
  //       ).res()
  //     );
  // }
  // let refreshToken_ = req.cookies.refreshToken;
  // if (!refreshToken_ || refreshToken_.length === 0) {
  //   return res
  //     .status(404)
  //     .json(new ApiErrorResponse({ message: "no refresh Token found" }, 404).res());
  // }
  // let decodedRefresh = verify(
  //   refreshToken_,
  //   tokenSecret.refresh,
  //   generateTokenOptions,
  //   "refresh"
  // );
  // let student = await Student.findOne({ _id: decodedRefresh._id });
  // if (
  //   String(decodedAccess._id) !== String(student._id) ||
  //   String(decodedRefresh._id) !== String(student._id) ||
  //   String(decodedAccess._id) !== String(req.student._id) ||
  //   String(decodedAccess.id) !== String(decodedRefresh.id) ||
  //   String(req.student._id) !== String(decodedRefresh.id)
  // ) {
  //   return res
  //     .status(404)
  //     .json(
  //       new ApiErrorResponse({ message: "Invalid or mismatched tokens" }, 404).res()
  //     );
  // }
  let student = await Student.findById(req.student._id);
  let payload = {
    _id: student._id,
    username: student.username,
    email: student.email,
    role: student.role || "student",
  };
  let { accessToken, refreshToken } = tokenGen(
    payload,
    tokenSecret,
    generateTokenOptions
  );
  student.refreshToken = refreshToken;
  await student.save({ validateBeforeSave: false });
  res.cookie("stuRefreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 15 * 7 * 24 * 60 * 60 * 1000, // 15 days
  });
  res.cookie("stuAccessToken", accessToken, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 1 * 7 * 24 * 60 * 60 * 1000, // 1 days
  });
  return res
    .status(200)
    .json(new ApiResponse({ accessToken: accessToken }, 200));
});

export let stuLogout = AsyncHandler(async (req, res) => {
  let { _id, username, email } = req.student;
  if ([_id, username, email].some((field) => !field?.trim())) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "Empty values provided" }).res());
  }
  let student = await Student.findOne({ _id, $or: [{ username, email }] });
  if (!student) {
    return res
      .status(404)
      .json(new ApiErrorResponse({ message: "student not found" }, 404).res());
  }

  student.refreshToken = null;
  await student.save();
  delete req.student;
  res.clearCookie(stuAccessToken);
  res.clearCookie(stuRefreshToken);
  res.status(200).json(new ApiResponse({ message: "student logout" }).res());
});
