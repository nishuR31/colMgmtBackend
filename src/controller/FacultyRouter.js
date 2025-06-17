import express from "express";
import AsyncHandler from "../utils/AsyncHandler.js";
import Faculty from "../models/Faculty.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { tokenGen } from "../utils/jwtTokens.js";
import { generateTokenOptions, tokenSecret } from "../Constants.js";
import ApiErrorResponse from "../utils/ApiErrorResponse.js";
import jwt from "jsonwebtoken";

let FacultyRouter = express.Router();

FacultyRouter.post(
  "/signup",
  AsyncHandler(async (req, res) => {
    const data = req.body;
    const newFaculty = await Faculty.create(data);
    return res.status(201).json(
      ApiResponse({
        success: true,
        message: "Faculty created successfully",
        Faculty: newFaculty,
      }).res()
    );
  })
);

FacultyRouter.post(
  "/del/:id",
  AsyncHandler(async (req, res) => {
    let id = req.params.id;
    let faculty = await Faculty.findByIdAndDelete({ id }).select(
      "-passsword -role -refreshToken -dob -branch -bloodGroup -department -designation"
    );
    if (!faculty) {
      return res
        .status(200)
        .json(ApiResponse({ message: `Faculty can\'t be removed` }, 400).res());
    }

    return res
      .status(202)
      .json(
        ApiResponse(
          { message: "Student successfully deleted", student: student },
          202
        ).res
      );
  })
);

FacultyRouter.post(
  "/signin",
  AsyncHandler(async (req, res) => {
    const { username, password, email } = req.body;

    const faculty = await Faculty.findOne({ username, email });
    if (!faculty) {
      return res
        .status(404)
        .json(
          ApiResponse({ message: "invalid credentials" }, 404, false).res()
        );
    }
    if (faculty.role !== "faculty") {
      return res
        .status(404)
        .json(
          ApiResponse(
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
          ApiResponse({ message: "invalid credentials" }, 400, false).res()
        );
    }

    let payloads = faculty.toObject();
    payload = {
      _id: payloads._id,
      username: payloads.username,
      email: payloads.email,
    };
    req.faculty = payload;

    let { accessToken, refreshToken } = tokenGen(
      payload,
      tokenSecret,
      generateTokenOptions
    );
    faculty.refreshToken = refreshToken;
    await faculty.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 15 * 7 * 24 * 60 * 60 * 1000, // 15 days
    });
    return res
      .status(200)
      .json(ApiResponse({ accessToken: accessToken }).res());
  })
);

FacultyRouter.get(
  "/:username",
  AsyncHandler(async (req, res) => {
    const username = req.params.username.toLowerCase().trim();

    const faculty = await Faculty.findOne({ username }).select(
      "-password -refreshToken -role -department -designation"
    );
    if (!faculty) {
      return res
        .status(404)
        .json(ApiResponse({ message: "Faculty not found" }, 404, false).res());
      //   res.redirect("/Faculty/signup");
    }

    return res.status(200).json(
      ApiResponse({
        success: true,
        message: "Faculty found",
        faculty, // You may want to filter out sensitive fields
      }).res()
    );
  })
);

FacultyRouter.post(
  "/:username/token",
  AsyncHandler(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(
          ApiErrorResponse({ message: "Unauthorized: No token provided" }).res()
        );
    }

    const accessToken_ = authHeader.split(" ")[1];

    // let decodedAccess = jwt.verify(accessToken_, tokenSecret.access);
    // if (!decodedAccess) {
    //   return res
    //     .status(400)
    //     .json(
    //       ApiErrorResponse({ message: "Token verification failed" }, 400).res()
    //     );
    // }

    let decodedAccess;
    try {
      decodedAccess = jwt.verify(accessToken_, tokenSecret.access);
    } catch (err) {
      return res
        .status(401)
        .json(
          ApiErrorResponse(
            { message: "Access token verification invalid" },
            401
          ).res()
        );
    }

    if (String(decodedAccess._id) !== String(req.faculty._id)) {
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
    if (!refreshToken_) {
      return res
        .status(404)
        .json(
          ApiErrorResponse({ message: "no refreshToken found" }, 404).res()
        );
    }
    let decodedRefresh = jwt.verify(refreshToken_, tokenSecret.refresh);
    let faculty = await Faculty.findOne({ _id: decodedRefresh._id });
    if (
      String(decodedAccess._id) !== String(faculty._id) ||
      String(decodedAccess._id) !== String(req.faculty._id)
    ) {
      return res
        .status(404)
        .json(
          ApiErrorResponse(
            { message: "Invalid or mismatched tokens" },
            404
          ).res()
        );
    }

    let { accessToken, refreshToken } = tokenGen(
      decodedRefresh,
      tokenSecret,
      generateTokenOptions
    );

    faculty.refreshToken = refreshToken;
    await faculty.save();
    return res.status(200).json(ApiResponse({ accessToken: accessToken }, 200));
  })
); //

export default FacultyRouter;
