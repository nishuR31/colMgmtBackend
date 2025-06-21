import asyncHandler from "./asyncHandler.js";

// Logger middleware wrapped with AsyncHandler
const Logger = asyncHandler(async (req, res, next) => {
  console.log({
    url: `${req.host}${req.originalUrl}`,
    method: req.method,
    param: req.params || "",
    query: req.query || "",
    time: new Date().toString(),
  });

  next();
});

export default Logger;
