import AsyncHandler from "./AsyncHandler.js";

export default function Logger() {
  return AsyncHandler((req, res, next) => {
    console.log({
      url: req.url,
      method: req.method,
      originalUrl: req.originalUrl,
      route: req.route.path,
      time: new Date().toString(),
    });
    next();
  });
}
