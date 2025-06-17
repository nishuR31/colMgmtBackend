import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiErrorResponse from "../utils/ApiErrorResponse.js";
import Logger from "../utils/Logger.js";

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
let port = 3000;
// app.use(Logger);

// app.use();
// app.use();
// app.use();
// app.use();

app.get(
  "/",
  AsyncHandler((req, res, next) => {
    next(error);
  })
);

app.get(
  "/home",
  AsyncHandler((req, res, next) => {
    res.send("home");
  })
);

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use((err, req, res, next) => {
  let error = new ApiErrorResponse(err).res();
  console.log(error);
  res.json(error);
});
