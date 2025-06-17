export default class ApiErrorResponse extends Error {
  constructor(err, statusCode = 500) {
    super(err.message || "Internal Error occured.");
    this.name = err.name || "Api error";
    this.statusCode = statusCode;
    this.stack = err.stack || new Error().stack;
  }

  res(devMode = true) {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      time: new Date().toString(),
      stack: devMode ? JSON.stringify(this.stack) : null, // optional: include or exclude based on prod/dev
    };
  }
}
