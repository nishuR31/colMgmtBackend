export default function AsyncHandler(func) {
  return async function (req, res, next) {
    try {
      await func(req, res, next);
    } catch (err) {
      console.error(`Error occurred: ${err.message}`);
      next(err); // Pass the error to Express error-handling middleware
    }
  };
}
