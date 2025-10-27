import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5050;
const CLIENT_URL = process.env.CLIENT_URL || "/";
const MANAGER_EMAIL = process.env.MANAGER_EMAIL || "";
const MANAGER_PASSWORD = process.env.MANAGER_PASSWORD || "";
const DATABASE_URL = process.env.DATABASE_URL || "";
const NODE_ENV = process.env.NODE_ENV || "developments";
const JWT_ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY || "";
const JWT_ACCESS_EXPIRE_TIME = process.env.JWT_ACCESS_EXPIRE_TIME || "";

export {
  PORT,
  CLIENT_URL,
  MANAGER_EMAIL,
  MANAGER_PASSWORD,
  DATABASE_URL,
  NODE_ENV,
  JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_EXPIRE_TIME,
};
