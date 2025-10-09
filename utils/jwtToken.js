import JWT from "jsonwebtoken";
import ApiError from "./apiError.js";
import {
  JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_EXPIRE_TIME,
} from "../config/index.js";

const generateAccessToken = (userId) => {
  try {
    const accessToken = JWT.sign({ userId }, JWT_ACCESS_SECRET_KEY, {
      expiresIn: JWT_ACCESS_EXPIRE_TIME,
    });

    return accessToken;
  } catch (err) {
    throw new ApiError(`Generate Access Token Error: ${err}`);
  }
};

const verifyToken = async (token, secretKey) => {
  try {
    const decoded = await JWT.verify(token, secretKey);
    return decoded;
  } catch (err) {
    throw new ApiError(`Verify Token Error: ${err}`);
  }
};

export { generateAccessToken, verifyToken };
