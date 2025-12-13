import { ApiError } from "../utils/ApiError.js";

const devError = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });

const prodError = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    devError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
      err = new ApiError(
        "Auth token is not provided or is invalid or may be expired",
        401
      );
    prodError(err, res);
  }
};

export default globalError;
