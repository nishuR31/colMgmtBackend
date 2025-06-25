import AsyncHandler from "../utils/asyncHandler.js";
import ApiErrorResponse from "../utils/apiErrorResponse.js";
import {
  verify,
  tokenSecret,
  generateTokenOptions,
} from "../utils/jwtTokens.js";

export default function authMiddleware(role = null) {
  return AsyncHandler(async (req, res, next) => {
    let reqRole = role.toLowerCase().trim();
    let Model;
    try {
      Model = (await import(`../models/${reqRole}.model.js`)).default;
    } catch (err) {
      return res
        .status(500)
        .json(
          ApiErrorResponse({ message: `Model for ${reqRole} not found` }).res()
        );
    }

    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json(
        new ApiErrorResponse({
          message: "Unauthorized: No token provided",
        }).res()
      );
    }

    let accessToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : req.cookies?.[`${reqRole}AccessToken`];

    let refreshToken = req.cookies?.[`${reqRole}RefreshToken`];
    // if ([accessToken, refreshToken].some((token) => !token?.trim())) {
    //   return res
    //     .status(404)
    //     .json(ApiErrorResponse({ message: "Tokens are missing" }, 404).res());
    // }

    if (!accessToken || !refreshToken) {
      return res
        .status(404)
        .json(ApiErrorResponse({ message: "Tokens are missing" }, 404).res());
    }
    let decodedAccess, decodedRefresh;
    try {
      decodedAccess = verify(
        accessToken,
        tokenSecret,
        generateTokenOptions,
        "access"
      );
      decodedRefresh = verify(
        refreshToken,
        tokenSecret,
        generateTokenOptions,
        "refresh"
      );
    } catch (err) {
      return res
        .status(401)
        .json(
          ApiErrorResponse({ message: "Error verifying tokens" }, 401).res()
        );
    }

    if (
      // req[role]._id !== decodedAccess._id ||
      // req[role]._id !== decodedRefresh._id ||
      decodedAccess._id !== decodedRefresh._id
    ) {
      return res
        .status(400)
        .json(ApiErrorResponse({ message: "Tokens mismatch" }).res());
    }

    let isAdmin =
      decodedAccess.role.toLowerCase().trim() === "admin" ||
      decodedRefresh.role.toLowerCase().trim() === "admin";

    if (
      reqRole &&
      !isAdmin &&
      (decodedAccess.role !== reqRole || decodedRefresh.role !== reqRole)
    ) {
      return res.status(403).json(
        ApiErrorResponse({
          message: `Access denied: expected ${reqRole}, got ${decodedRefresh.role}`,
        }).res()
      );
    }

    let model = await Model.findById(decodedRefresh._id);
    if (model.role.toLowerCase().trim() !== reqRole && !isAdmin) {
      return res
        .status(403)
        .json(
          ApiErrorResponse({ message: "Role mismatch with DB" }, 403).res()
        );
    }
    if (refreshToken !== model.refreshToken) {
      return res
        .status(404)
        .json(
          ApiErrorResponse({ message: "RefreshToken match failed" }, 404).res()
        );
    }
    let payload = {
      _id: model._id,
      username: model.username,
      role: model.role,
      email: model.email,
    };
    req[reqRole] = payload;
    next();
  });
}
