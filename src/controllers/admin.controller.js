import ApiErrorResponse from "../utils/ApiErrorResponse";
import { generateTokenOptions, tokenSecret } from "../Constants";
import AsyncHandler from "../utils/AsyncHandler";
import { tokenGen, verify } from "../utils/jwtTokens";
import ApiResponse from "../utils/ApiResponse";
import { use } from "react";

export let adminSignup = AsyncHandler(async (req, res) => {
  const data = req.body;
  let { username } = data;
  if ([username].some((field) => field.length === 0)) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "fields were missing" }).res());
  }
  let admin = await Admin.findOne(username);
  if (admin) {
    return res
      .status(200)
      .json(ApiErrorResponse({ message: "Admin already exists" }, 200).res());
  }
  const newAdmin = await Admin.create(data);
  return res.status(201).json(
    ApiResponse({
      success: true,
      message: "Admin created successfully",
      admin: newAdmin.username,
    }).res()
  );
});

export let adminDel = AsyncHandler(async (req, res) => {
  let id = req.params.id;
  if ([id].some((field) => field.length === 0)) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "fields were missing" }).res());
  }
  if (req.admin && req.admin._id.toString() === id) {
    return res.status(403).json(
      ApiErrorResponse({
        message: "You cannot delete your own admin account",
      }).res()
    );
  }
  let admin = await Admin.findByIdAndDelete({ _id: id });
  if (!admin) {
    return res
      .status(404)
      .json(
        ApiErrorResponse(
          { message: "Cant delete because Admin dont exist" },
          404
        ).res()
      );
  }
  return res
    .status(200)
    .json(
      ApiResponse({ message: "Admin deleted", admin: admin.username }).res()
    );
});

export let adminSignin = AsyncHandler(async (req, res) => {
  const { username, password, role } = req.body;
  if ([username, password, role].some((field) => field.length === 0)) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "fields were missing" }).res());
  }
  const admin = await Admin.findOne({ username });
  if (!admin) {
    return res
      .status(404)
      .json(
        ApiErrorResponse({ message: "invalid credentials" }, 404, false).res()
      );
  }
  if (role !== "admin") {
    return res
      .status(404)
      .json(
        ApiErrorResponse(
          { message: "Access denied: Not admin" },
          404,
          false
        ).res()
      );
  }
  let isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return res
      .status(400)
      .json(
        ApiErrorResponse({ message: "invalid password" }, 400, false).res()
      );
  }
  let payload = { _id: admin._id, username: admin.username };
  req.admin = payload;
  let { accessToken, refreshToken } = tokenGen(
    payload,
    tokenSecret,
    generateTokenOptions
  );
  admin.refreshToken = refreshToken;
  await admin.save();
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
  });
  res.status(200).json(ApiResponse({ accessToken: accessToken }).res());
});

export let adminUser = AsyncHandler(async (req, res) => {
  const username = req.params.username.toLowerCase().trim();
  if ([username].some((field) => field.length === 0)) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "fields were missing" }).res());
  }
  const admin = await Admin.findOne({ username });
  if (!admin) {
    return res
      .status(404)
      .json(ApiErrorResponse({ message: "Admin not found" }, 404, false).res());
    //   res.redirect("/admin/signup");
  }
  return res.status(200).json(
    ApiResponse({
      success: true,
      message: "Admin found",
      admin: admin.username, // You may want to filter out sensitive fields
    }).res()
  );
});

export let adminToken = AsyncHandler(async (req, res) => {
  let authHeader = req.header["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(403)
      .json(
        ApiErrorResponse({ message: "Unauthorized: No token provided" }).res()
      );
  }

  let accessToken_ = authHeader.split(" ")[1];
  if ([accessToken_].some((field) => field.length === 0)) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "fields were missing" }).res());
  }
  let decodedAccess;
  try {
    decodedAccess = verify(
      accessToken_,
      tokenSecret,
      generateTokenOptions,
      "access"
    );
  } catch (err) {
    return res
      .status(401)
      .json(ApiErrorResponse({ message: "Access token invalid" }, 401).res());
  }
  if (decodedAccess._id !== req.admin._id) {
    return res
      .status(401)
      .json(
        ApiErrorResponse(
          { message: "Access token expired or invalid" },
          401
        ).res()
      );
  }

  let refreshToken_ = req.cookies.refreshToken;
  if (!refreshToken_ || refreshToken_.length === 0) {
    return res
      .status(400)
      .json(
        ApiErrorResponse({ message: "refresh token not found" }, 400).res()
      );
  }
  let decodedRefesh;
  try {
    decodedRefesh = verify(
      refreshToken_,
      tokenSecret,
      generateTokenOptions,
      "refresh"
    );
  } catch (err) {
    return res
      .status(401)
      .json(ApiErrorResponse({ message: "Refresh token invalid" }, 401).res());
  }

  let admin = await Admin.findById({ _id: decodedRefesh._id });
  if (
    String(admin._id) !== String(decodedAccess._id) ||
    String(admin._id) !== String(decodedRefesh._id) ||
    String(decodedRefesh._id) !== String(decodedAccess._id) ||
    String(req.admin._id) !== String(decodedRefesh._id) ||
    String(req.admin._id) !== String(decodedAccess._id)
  ) {
    return res
      .status(400)
      .json(
        ApiErrorResponse({ message: "Invalid or mismatched tokens" }).res()
      );
  }

  let { accessToken, refreshToken } = tokenGen(
    decodedRefesh,
    tokenSecret,
    generateTokenOptions
  );
  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });

  return res.status(200).json(ApiResponse({ accessToken: accessToken }).res());
});
