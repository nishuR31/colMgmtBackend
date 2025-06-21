import { generateTokenOptions, tokenSecret } from "../Constants.js";
import Faculty from "../models/falculty.model.js";
import ApiErrorResponse from "../utils/ApiErrorResponse.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { verify, tokenGen } from "../utils/jwtTokens.js";

export let facSignup = AsyncHandler(async (req, res) => {
  const data = req.body;
  let {
    username,
    fullName,
    email,
    password,
    dob,
    phone,
    role,
    bloodGroup,
    designation,
    department,
  } = data;
  if (
    [
      username,
      fullName,
      email,
      password,
      dob,
      phone,
      role,
      bloodGroup,
      designation,
      department,
    ].some((field) => !field?.trim())
  ) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "fields were missing" }).res());
  }
  let faculty = await Faculty.findOne({
    username,
    $or: [{ fullName }, { email }],
  });
  if (faculty) {
    return res
      .status(200)
      .json(ApiErrorResponse({ message: "faculty already exists" }).res());
  }
  const newFaculty = await Faculty.create(data);
  if (!newFaculty) {
    return res
      .status(500)
      .json(ApiResponse({ message: "faculty creation failed" }, 500).res());
  }
  return res.status(201).json(
    ApiResponse({
      success: true,
      message: "Faculty created successfully",
      Faculty: { username: newFaculty.username, fullName: newFaculty.fullName },
    }).res()
  );
});

export let facEdit = AsyncHandler(async (req, res) => {
  const data = req.body;
  let edit = req.query.edit;
  let {
    username,
    fullName,
    email,
    password,
    dob,
    phone,
    role,
    bloodGroup,
    designation,
    department,
  } = data;
  if (
    [
      username,
      fullName,
      email,
      password,
      dob,
      edit,
      phone,
      role,
      bloodGroup,
      designation,
      department,
    ].some((field) => !field?.trim())
  ) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "fields were missing" }).res());
  }
  if (edit.toLowerCase().trim() !== "edit") {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "Invalid edit query" }).res());
  }
  let faculty = await Faculty.findOne({
    username,
    $or: [{ fullName }, { email }],
  });
  if (!faculty) {
    return res
      .status(404)
      .json(ApiErrorResponse({ message: "faculty dont exist" }, 404).res());
  }

  const newFaculty = await Faculty.findOneAndUpdate(
    { username, $or: [{ email }] },
    { ...date },
    { new: true, validateBeforeSave: false }
  );
  if (!newFaculty) {
    return res
      .status(500)
      .json(ApiResponse({ message: "faculty creation failed" }, 500).res());
  }
  return res.status(201).json(
    ApiResponse({
      success: true,
      message: "Faculty created successfully",
      Faculty: { username: newFaculty.username, fullName: newFaculty.fullName },
    }).res()
  );
});

export let facDel = AsyncHandler(async (req, res) => {
  let id = req.params.id;
  if ([id].some((field) => !field?.trim() || !id)) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "fields were missing" }).res());
  }
  if (req?.faculty && req?.faculty._id !== id) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "Cant delete other faculties" }).res());
  }
  let faculty = await Faculty.findByIdAndDelete({ _id: id });
  if (!faculty) {
    return res
      .status(200)
      .json(ApiResponse({ message: `Faculty can\'t be removed` }, 400).res());
  }

  return res
    .status(200)
    .json(
      ApiResponse(
        { message: "Faculty successfully deleted", faculty: faculty.username },
        200
      ).res()
    );
});

export let facSignin = AsyncHandler(async (req, res) => {
  const { username, password, phone, email, role } = req?.body;
  if (
    [password, email, phone, username, role].some((field) => !field?.trim())
  ) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "fields were missing" }).res());
  }
  const faculty = await Faculty.findOne({
    username,
    $or: [{ email }],
  });
  if (!faculty) {
    return res
      .status(404)
      .json(
        ApiErrorResponse({ message: "invalid credentials" }, 404, false).res()
      );
  }
  if (role.toLowerCase().trim() !== "faculty") {
    return res
      .status(404)
      .json(
        ApiErrorResponse(
          { message: "Access denied: Not Faculty" },
          404,
          false
        ).res()
      );
  }

  let isMatch = await faculty.comparePassword(password);
  if (!isMatch) {
    return res
      .status(400)
      .json(
        ApiErrorResponse({ message: "invalid credentials" }, 400, false).res()
      );
  }

  let payload = {
    _id: faculty._id,
    username: faculty.username,
    email: faculty.email,
  };
  req.faculty = payload;

  let { accessToken, refreshToken } = tokenGen(
    payload,
    tokenSecret,
    generateTokenOptions
  );
  faculty.refreshToken = refreshToken;
  await faculty.save();
  res.cookie("facRefreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 15 * 7 * 24 * 60 * 60 * 1000, // 15 days
  });
  res.cookie("facAccessToken", accessToken, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 1 * 7 * 24 * 60 * 60 * 1000, // 1 days
  });
  return res.status(200).json(ApiResponse({ accessToken: accessToken }).res());
});

export let facUser = AsyncHandler(async (req, res) => {
  const username = req.params.username.toLowerCase().trim();
  if ([username].some((field) => !field?.trim())) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "fields were missing" }).res());
  }
  const faculty = await Faculty.findOne({ username });
  if (!faculty) {
    return res
      .status(404)
      .json(
        ApiErrorResponse({ message: "Faculty not found" }, 404, false).res()
      );
    //   res?.redirect("/Faculty/signup");
  }

  return res.status(200).json(
    ApiResponse({
      success: true,
      message: "Faculty found",
      faculty: faculty.username, // You may want to filter out sensitive fields
    }).res()
  );
});

export let facToken = AsyncHandler(async (req, res, next) => {
  // const authHeader = req?.headers["authorization"];
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return res
  //     .status(401)
  //     .json(
  //       ApiErrorResponse({ message: "Unauthorized: No token provided" }).res()
  //     );
  // }

  // const accessToken_ = authHeader.split(" ")[1];
  // if (!accessToken_ || accessToken_.length === 0) {
  //   return res
  //     .status(400)
  //     .json(ApiErrorResponse({ message: "access token is missing" }).res());
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
  //     .json(
  //       ApiErrorResponse(
  //         { message: "Access token verification invalid" },
  //         401
  //       ).res()
  //     );
  // }

  // if (String(decodedAccess._id) !== String(req?.faculty._id)) {
  //   return res
  //     .status(400)
  //     .json(
  //       ApiErrorResponse(
  //         { Message: "expired or invalid access token" },
  //         400
  //       ).res()
  //     );
  // }

  // let refreshToken_ = req?.cookies.refreshToken;
  // if (!refreshToken_ || refreshToken_.length === 0) {
  //   return res
  //     .status(404)
  //     .json(ApiErrorResponse({ message: "no refreshToken found" }, 404).res());
  // }
  // let decodedRefresh = verify(
  //   refreshToken_,
  //   tokenSecret.refresh,
  //   generateTokenOptions,
  //   "refresh"
  // );
  // let faculty = await Faculty.findOne({ _id: decodedRefresh._id });
  // if (
  //   String(decodedAccess._id) !== String(faculty._id) ||
  //   String(decodedAccess._id) !== String(req?.faculty._id) ||
  //   String(decodedAccess._id) !== String(decodedRefresh._id) ||
  //   String(decodedRefresh._id) !== String(req?.faculty._id) ||
  //   String(decodedRefresh._id) !== String(faculty._id)
  // ) {
  //   return res
  //     .status(404)
  //     .json(
  //       ApiErrorResponse({ message: "Invalid or mismatched tokens" }, 404).res()
  //     );
  // }
  let faculty = await Faculty.findById(req.faculty._id);
  let payload = {
    _id: faculty._id,
    username: faculty.username,
    email: faculty.email,
  };
  let { accessToken, refreshToken } = tokenGen(
    payload,
    tokenSecret,
    generateTokenOptions
  );
  faculty.refreshToken = refreshToken;
  await faculty.save({ validateBeforeSave: false });
  res.cookie("facRefreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 15 * 7 * 24 * 60 * 60 * 1000, // 15 days
  });
  res.cookie("facAccessToken", accessToken, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 1 * 7 * 24 * 60 * 60 * 1000, // 1 days
  });
  return res.status(200).json(ApiResponse({ accessToken: accessToken }, 200));
});

export let faclogout = AsyncHandler(async (req, res) => {
  let { _id, username, email } = req.faculty;
  if ([_id, username, email].some((field) => !field?.trim())) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "empty values provided" }).res());
  }
  let faculty = await Faculty.findOne({ _id, $or: [{ username }, { email }] });
  if (!faculty) {
    return res
      .status(404)
      .json(ApiErrorResponse({ message: "faculty not found" }).res());
  }

  faculty.refreshTokwn = null;
  res.clearCookie(facAccesstoken);
  res.clearCookie(facResfreshtoken);
  delete req.faculty;
  return res.status(200).json(ApiResponse({ message: "Faculty logout" }).res());
});
