import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import ApiErrorResponse from "../utils/ApiErrorResponse.js";
import Logger from "../utils/Logger.js";
import AllRoute from "../routes/all.route.js";

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(cookieParser());
let port = 3000;
app.use(Logger);
let baseUri = "/api/v1";

app.use(baseUri, AllRoute);

app.get("/", (req, res) => {
  res.send("Server running");
});
app.get("/home", (req, res) => {
  res.send("Hehe");
  // (`uri contains admin route? ${req.url.includes("admin")}`);
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// 12384 asansol 6:40 intercity
// morning 6:10,3:00,4:50 adra,
// // 21:asansol->next day purulia: 10:30,
app.use((err, req, res, next) => {
  let error = new ApiErrorResponse(err).res();
  console.log(error);
  res.json(error);
});
