import express from "express";
import AsyncHandler from "../utils/AsyncHandler.js";
import Admin from "../models/Admin.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiErrorResponse from "../utils/ApiErrorResponse.js";
import { tokenGen } from "../utils/jwtTokens.js";
import { generateTokenOptions, tokenSecret } from "../Constants.js";

let AdminRouter = express.Router();

AdminRouter.post(
  "/signup",
  AsyncHandler(async (req, res) => {
    const data = req.body;
    const newAdmin = await Admin.create(data);
    return res.status(201).json(
      ApiResponse({
        success: true,
        message: "Admin created successfully",
        admin: newAdmin,
      }).res()
    );
  })
);

AdminRouter.post(
  "/signin",
  AsyncHandler(async (req, res) => {
    const { username, password, role } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res
        .status(404)
        .json(
          ApiErrorResponse({ message: "invalid credentials" }, 404, false).res()
        );
    }
    if (admin.role !== "admin") {
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
    let payloads = admin.toObject();
    let payload = { _id: payloads._id, username: payloads.username };
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
  })
);

AdminRouter.get(
  "/:username",
  AsyncHandler(async (req, res) => {
    const username = req.params.username.toLowerCase().trim();

    const admin = await Admin.findOne({ username }).select(
      "-password -role -refreshToken"
    );
    if (!admin) {
      return res
        .status(404)
        .json(
          ApiErrorResponse({ message: "Admin not found" }, 404, false).res()
        );
      //   res.redirect("/admin/signup");
    }

    return res.status(200).json(
      ApiResponse({
        success: true,
        message: "Admin found",
        admin, // You may want to filter out sensitive fields
      }).res()
    );
  })
);

AdminRouter.post(
  "/del/:id",
  AsyncHandler(async (req, res) => {
    let id = req.params.id;
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
      .json(ApiResponse({ message: "Admin deleted", admin: admin }).res());
  })
);

export default AdminRouter;
