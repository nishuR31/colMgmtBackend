import Student from "../models/student.model.js";
import ApiErrorResponse from "../utils/ApiErrorResponse.js";
import { verify, tokenGen } from "../utils/jwtTokens.js";
import { tokenSecret, generateTokenOptions, password } from "../Constants.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";

export let stuSignup = AsyncHandler(async (req, res) => {
  const data = req.body;
  let {
    username,
    fullName,
    password,
    email,
    dob,
    branch,
    role,
    program,
    bloodGroup,
    course,
    marks,
    gaurdianContactInfo,
  } = data;
  if (
    [
      username,
      fullName,
      password,
      email,
      dob,
      branch,
      role,
      program,
      bloodGroup,
      course,
      marks,
      gaurdianContactInfo,
    ].some((field) => field.length === 0)
  ) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "Missing fields" }).res());
  }

  let student = await Student.findOne({
    $or: [{ username }, { fullName }, { email }],
  });
  if (student) {
    return res
      .status(204)
      .json(ApiErrorResponse({ message: "Student already exists" }).res());
  }
  const newStudent = await Student.create(data);
  if (!newStudent) {
    return res
      .status(500)
      .json(ApiResponse({ message: "Student creation failed" }, 500).res());
  }
  return res.status(201).json(
    ApiResponse({
      success: true,
      message: "Student created successfully",
      Student: { username: username, name: fullName },
    }).res()
  );
});

export let stuUser = AsyncHandler(async (req, res) => {
  const username = req.params.username.toLowerCase().trim();
  if ([username].some((field) => field.length === 0)) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "fields were missing" }).res());
  }
  const student = await Student.findOne({ username }).select(
    "-password -refreshToken -role -"
  );
  if (!student) {
    return res
      .status(404)
      .json(
        ApiErrorResponse({ message: "Student not found" }, 404, false).res()
      );
    //   res.redirect("/Student/signup");
  }
  return res.status(200).json(
    ApiResponse({
      success: true,
      message: "Student found",
      student: { username: student.username }, // You may want to filter out sensitive fields
    }).res()
  );
});

export let stuSignin = AsyncHandler(async (req, res) => {
  const { username, password, email, role } = req.body;
  if ([username, password, email, role].some((field) => field.length === 0)) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "Missing fields" }).res());
  }

  const student = await Student.findOne({ $or: [{ username }, { email }] });
  if (!student) {
    return res
      .status(404)
      .json(
        ApiErrorResponse({ message: "invalid credentials" }, 404, false).res()
      );
  }
  if (role !== "student") {
    return res
      .status(404)
      .json(
        ApiErrorResponse(
          { message: "Access denied: Not Student" },
          404,
          false
        ).res()
      );
  }
  let isMatch = await student.comparePassword(password);
  if (!isMatch) {
    return res
      .status(400)
      .json(
        ApiErrorResponse({ message: "invalid credentials" }, 400, false).res()
      );
  }
  let payload = {
    _id: student._id,
    username: student.username,
    email: student.email,
  };
  req.student = payload;
  let { accessToken, refreshToken } = tokenGen(
    payload,
    tokenSecret,
    generateTokenOptions
  );
  student.refreshToken = refreshToken;
  await student.save({ validateBeforeSave: false });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 15 * 7 * 24 * 60 * 60 * 1000, // 15 days
  });
  return res.status(200).json(ApiResponse({ accessToken: accessToken }).res());
});

export let stuDel = AsyncHandler(async (req, res) => {
  let id = req.params?.id;
  if ([id].some((field) => field.length === 0)) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "fields were missing" }).res());
  }
  if (req.student && req?.student._id.toString() === id) {
    return res
      .status(403)
      .json(
        ApiErrorResponse(
          { message: "You cannot delete your student id" },
          403
        ).res()
      );
  }
  let student = await Student.findByIdAndDelete({ id });
  if (!student) {
    return res
      .status(200)
      .json(
        ApiErrorResponse({ message: `Student can\'t be removed` }, 400).res()
      );
  }
  return res
    .status(202)
    .json(
      ApiResponse(
        { message: "Student successfully deleted", student: student.username },
        202
      ).res
    );
});

export let stuToken = AsyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json(
        ApiErrorResponse({ message: "Unauthorized: No token provided" }).res()
      );
  }
  const accessToken_ = authHeader.split(" ")[1];
  if (!accessToken_ || accessToken_.length === 0) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "No access token found" }).res());
  }
  let decodedAccess;
  try {
    decodedAccess = verify(
      accessToken_,
      tokenSecret.access,
      generateTokenOptions,
      "access"
    );
  } catch (err) {
    return res
      .status(401)
      .json(ApiErrorResponse({ message: "Access token invalid" }, 401).res());
  }
  if (String(decodedAccess._id) !== String(req.student._id)) {
    return res
      .status(400)
      .json(
        ApiErrorResponse(
          { Message: "expired or invalid access token" },
          400
        ).res()
      );
  }
  let refreshToken_ = req.cookies.refreshToken;
  if (!refreshToken_ || refreshToken_.length === 0) {
    return res
      .status(404)
      .json(ApiErrorResponse({ message: "no refresh Token found" }, 404).res());
  }
  let decodedRefresh = verify(
    refreshToken_,
    tokenSecret.refresh,
    generateTokenOptions,
    "refresh"
  );
  let student = await Student.findOne({ _id: decodedRefresh._id });
  if (
    String(decodedAccess._id) !== String(student._id) ||
    String(decodedRefresh._id) !== String(student._id) ||
    String(decodedAccess._id) !== String(req.student._id) ||
    String(decodedAccess.id) !== String(decodedRefresh.id) ||
    String(req.student._id) !== String(decodedRefresh.id)
  ) {
    return res
      .status(404)
      .json(
        ApiErrorResponse({ message: "Invalid or mismatched tokens" }, 404).res()
      );
  }
  let { accessToken, refreshToken } = tokenGen(
    decodedRefresh,
    tokenSecret,
    generateTokenOptions
  );
  student.refreshToken = refreshToken;
  await student.save({ validateBeforeSave: false });
  return res.status(200).json(ApiResponse({ accessToken: accessToken }, 200));
});
