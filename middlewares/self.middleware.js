import ApiError from "../utils/ApiError.js";

const selfMiddleware = async (req, res, next) => {
  if (req.params.id !== req.user.id)
    return next(
      new ApiError("Forbidden, you can only access your own data", 403)
    );

  next();
};

export { selfMiddleware };
