import express from "express";
import AsyncHandler from "../utils/AsyncHandler.js";
import Student from "../models/Student.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { tokenGen } from "../utils/jwtTokens.js";
import { generateTokenOptions, tokenSecret } from "../Constants.js";
import ApiErrorResponse from "../utils/ApiErrorResponse.js";
import jwt from "jsonwebtoken";

let StudentRouter = express.Router();

StudentRouter.post(
  "/signup",
  AsyncHandler(async (req, res) => {
    const data = req.body;
    const newStudent = await Student.create(data);
    return res.status(201).json(
      ApiResponse({
        success: true,
        message: "Student created successfully",
        Student: newStudent,
      }).res()
    );
  })
);

StudentRouter.post(
  "/del/:id",
  AsyncHandler(async (req, res) => {
    let id = req.params.id;
    if (req.student && req.student._id.toString() === id) {
      return res
        .status(403)
        .json(
          ApiErrorResponse(
            { message: "You cannot delete your student id" },
            403
          ).res()
        );
    }
    let student = await Student.findByIdAndDelete({ id }).select(
      "-passsword -role -address -refreshToken -dob -branch -bloodGroup -guardianContactInfo -marks -program"
    );
    if (!student) {
      return res
        .status(200)
        .json(ApiResponse({ message: `Student can\'t be removed` }, 400).res());
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

StudentRouter.post(
  "/signin",
  AsyncHandler(async (req, res) => {
    const { username, password, email } = req.body;

    const student = await Student.findOne({ username, email });
    if (!student) {
      return res
        .status(404)
        .json(
          ApiResponse({ message: "invalid credentials" }, 404, false).res()
        );
    }
    if (student.role !== "student") {
      return res
        .status(404)
        .json(
          ApiResponse(
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
          ApiResponse({ message: "invalid credentials" }, 400, false).res()
        );
    }

    let payloads = student.toObject();
    let payload = {
      _id: payloads._id,
      username: payloads.username,
      email: payloads.email,
    };
    req.student = payload;

    let { accessToken, refreshToken } = tokenGen(
      payload,
      tokenSecret,
      generateTokenOptions
    );
    student.refreshToken = refreshToken;
    await student.save();
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

StudentRouter.get(
  "/:username",
  AsyncHandler(async (req, res) => {
    const username = req.params.username.toLowerCase().trim();

    const student = await Student.findOne({ username }).select(
      "-password -refreshToken -role -"
    );
    if (!student) {
      return res
        .status(404)
        .json(ApiResponse({ message: "Student not found" }, 404, false).res());
      //   res.redirect("/Student/signup");
    }

    return res.status(200).json(
      ApiResponse({
        success: true,
        message: "Student found",
        student, // You may want to filter out sensitive fields
      }).res()
    );
  })
);

StudentRouter.post(
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
    if (!refreshToken_) {
      return res
        .status(404)
        .json(
          ApiErrorResponse({ message: "no refreshToken found" }, 404).res()
        );
    }
    let decodedRefresh = jwt.verify(refreshToken_, tokenSecret.refresh);
    let student = await Student.findOne({ _id: decodedRefresh._id });
    if (
      String(decodedAccess._id) !== String(student._id) ||
      String(decodedAccess._id) !== String(req.student._id)
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

    student.refreshToken = refreshToken;
    await student.save();
    return res.status(200).json(ApiResponse({ accessToken: accessToken }, 200));
  })
); //

export default StudentRouter;
