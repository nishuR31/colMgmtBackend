export default class ApiResponse {
  constructor(data, statusCode = 200, success = true) {
    this.data = data;
    this.statusCode = statusCode;
    this.success = success;
  }

  res() {
    return JSON.stringify({
      data: this.data,
      statusCode: this.statusCode,
      success: this.success,
      time: new Date().toLocaleString(),
    });
  }
}
