import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5050;
export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/medical-rep-system";
