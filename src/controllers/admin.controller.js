import ApiErrorResponse from "../utils/apiErrorResponse.js";
import { generateTokenOptions, tokenSecret } from "../constants.js";
import AsyncHandler from "../utils/asyncHandler.js";
import { tokenGen, verify } from "../utils/jwtTokens.js";
import ApiResponse from "../utils/apiResponse.js";
import Admin from "../models/admin.model.js";

export let adminSignup = AsyncHandler(async (req, res) => {
  const data = req.body;
  let { username, password, phone, email } = data;
  if ([username, password, phone, email].some((field) => !field?.trim())) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "fields were missing" }).res());
  }
  let admin = await Admin.findOne({ username, $or: [{ email }] });
  if (admin) {
    return res
      .status(200)
      .json(
        new ApiErrorResponse({ message: "Admin already exists" }, 200).res()
      );
  }
  const newAdmin = await Admin.create({ ...data });
  return res.status(201).json(
    new ApiResponse({
      success: true,
      message: "Admin created successfully",
      admin: newAdmin.username,
    }).res()
  );
});

export let adminEdit = AsyncHandler(async (req, res) => {
  const data = req.body;
  let { username, password, phone, email } = data;
  if ([username, password, phone, email].some((field) => !field?.trim())) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "fields were missing" }).res());
  }

  let admin = await Admin.findOneAndUpdate(
    { username, $or: [{ email }, { phone }] },
    { ...data },
    { new: true, validateBeforeSave: false }
  );
  if (!admin) {
    return res
      .status(400)
      .json(
        new ApiErrorResponse({ message: "Admin updatation failed" }, 400).res()
      );
  }
  return res.status(201).json(
    new ApiResponse({
      success: true,
      message: "Admin created successfully",
      admin: newAdmin.username,
    }).res()
  );
});

export let adminDel = AsyncHandler(async (req, res) => {
  let { id, username } = req.params;
  if ([id].some((field) => !field?.trim())) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "field is missing" }).res());
  }
  if (req.admin && req.admin._id.toString() === id) {
    return res.status(403).json(
      new ApiErrorResponse({
        message: "You cannot delete your own admin account",
      }).res()
    );
  }
  let admin = await Admin.findOneAndDelete({ id, $or: [username] });
  if (!admin) {
    return res
      .status(404)
      .json(
        new ApiErrorResponse(
          { message: "Cant delete because Admin dont exist" },
          404
        ).res()
      );
  }
  return res
    .status(200)
    .json(
      new ApiResponse({ message: "Admin deleted", admin: admin.username }).res()
    );
});

export let adminSignin = AsyncHandler(async (req, res) => {
  const { username, password, phone, email, role } = req.body;
  // let url = req.url;
  if (
    [username, password, phone, email, role].some((field) => !field?.trim())
  ) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "fields were missing" }).res());
  }
  const admin = await Admin.findOne({ username, $or: [{ email }] });
  if (!admin) {
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
  if (role.toLowerCase().trim() !== "admin") {
    return res
      .status(408)
      .json(
        new ApiErrorResponse(
          { message: "Access denied: Not admin" },
          408,
          false
        ).res()
      );
  }
  let isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return res
      .status(400)
      .json(
        new ApiErrorResponse({ message: "invalid password" }, 400, false).res()
      );
  }
  let payload = {
    _id: admin._id,
    username: admin.username,
    email: admin.email,
    role: admin.role || "admin",
  };
  req.admin = payload;
  let { accessToken, refreshToken } = tokenGen(
    payload,
    tokenSecret,
    generateTokenOptions
  );
  admin.refreshToken = refreshToken;
  await admin.save();
  res.cookie("adminRefreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    path: "/admin",
    maxAge: 15 * 7 * 24 * 60 * 60 * 1000, // 15 days
  });
  res.cookie("adminAccessToken", accessToken, {
    httpOnly: true,
    sameSite: "Strict",
    path: "/admin",
    maxAge: 1 * 7 * 24 * 60 * 60 * 1000, // 1 days
  });
  res.status(200).json(new ApiResponse({ accessToken: accessToken }).res());
});

export let adminUser = AsyncHandler(async (req, res) => {
  const username = req.params.username.toLowerCase().trim();
  if ([username].some((field) => !field?.trim())) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "fields were missing" }).res());
  }
  const admin = await Admin.findOne({ username });
  if (!admin) {
    return res
      .status(404)
      .json(
        new ApiErrorResponse({ message: "Admin not found" }, 404, false).res()
      );
    //   res.redirect("/admin/signup");
  }
  return res.status(200).json(
    new ApiResponse({
      success: true,
      message: "Admin found",
      admin: admin.username, // You may want to filter out sensitive fields
    }).res()
  );
});

export let adminToken = AsyncHandler(async (req, res) => {
  // let authHeader = req.header["authorization"];
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return res
  //     .status(403)
  //     .json(
  //       new ApiErrorResponse({ message: "Unauthorized: No token provided" }).res()
  //     );
  // }

  // let accessToken_ = authHeader.split(" ")[1];
  // if ([accessToken_].some((field) => field.length === 0)) {
  //   return res
  //     .status(400)
  //     .json(new ApiErrorResponse({ message: "bearer token is missing" }).res());
  // }
  // let decodedAccess;
  // try {
  //   decodedAccess = verify(
  //     accessToken_,
  //     tokenSecret,
  //     generateTokenOptions,
  //     "access"
  //   );
  // } catch (err) {
  //   return res
  //     .status(401)
  //     .json(new ApiErrorResponse({ message: "Access token invalid" }, 401).res());
  // }
  // if (decodedAccess._id !== req.admin._id) {
  //   return res
  //     .status(401)
  //     .json(
  //       new ApiErrorResponse(
  //         { message: "Access token expired or invalid" },
  //         401
  //       ).res()
  //     );
  // }

  // let refreshToken_ = req.cookies.refreshToken;
  // if (!refreshToken_ || refreshToken_.length === 0) {
  //   return res
  //     .status(400)
  //     .json(
  //       new ApiErrorResponse({ message: "refresh token not found" }, 400).res()
  //     );
  // }
  // let decodedRefesh;
  // try {
  //   decodedRefesh = verify(
  //     refreshToken_,
  //     tokenSecret,
  //     generateTokenOptions,
  //     "refresh"
  //   );
  // } catch (err) {
  //   return res
  //     .status(401)
  //     .json(new ApiErrorResponse({ message: "Refresh token invalid" }, 401).res());
  // }

  // let admin = await Admin.findById({
  //   _id: decodedRefesh._id,
  //   $or: [decodedRefesh._id],
  // });
  // if (
  //   String(admin._id) !== String(decodedAccess._id) ||
  //   String(admin._id) !== String(decodedRefesh._id) ||
  //   String(decodedRefesh._id) !== String(decodedAccess._id) ||
  //   String(req.admin._id) !== String(decodedRefesh._id) ||
  //   String(req.admin._id) !== String(decodedAccess._id)
  // ) {
  //   return res
  //     .status(400)
  //     .json(
  //       new ApiErrorResponse({ message: "Invalid or mismatched tokens" }).res()
  //     );
  // }

  let admin = Admin.findByid(req.admin._id);
  let payload = {
    _id: admin._id,
    username: admin.username,
    email: admin.email,
    role: admin.role || "admin",
  };
  // let payload = {
  //   _id: req.admin._id,
  //   username: req.admin.username,
  //   email: req.admin.email,
  // };
  let { accessToken, refreshToken } = tokenGen(
    payload,
    tokenSecret,
    generateTokenOptions
  );
  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });
  res.cookie("adminRefreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    path: "/admin",
    maxAge: 15 * 7 * 24 * 60 * 60 * 1000, // 15 days
  });
  res.cookie("adminAccessToken", accessToken, {
    httpOnly: true,
    sameSite: "Strict",
    path: "/admin",
    maxAge: 1 * 7 * 24 * 60 * 60 * 1000, // 1 days
  });
  return res
    .status(200)
    .json(new ApiResponse({ accessToken: accessToken }).res());
});

export let adminLogout = AsyncHandler(async (req, res) => {
  let { _id, username, email } = req.admin;
  // delete req.admin;
  let admin = Admin.findOne({ _id, $or: [{ username }, { email }] });
  if (!admin) {
    return res
      .status(400)
      .json(new ApiErrorResponse({ message: "Failed to find admin" }).res());
  }
  admin.refreshToken = null;
  await admin.save();
  res.clearCookie(adminRefreshToken);
  res.clearCookie(adminAccessToken);
  delete req.admin;
  res.status(200).json(new ApiResponse({ message: "Admin logout" }).res());
});
