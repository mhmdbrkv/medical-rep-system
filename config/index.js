import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5050;
const MANAGER_EMAIL = process.env.MANAGER_EMAIL || "";
const MANAGER_PASSWORD = process.env.MANAGER_PASSWORD || "";
const DATABASE_URL = process.env.DATABASE_URL || "";

export { PORT, MANAGER_EMAIL, MANAGER_PASSWORD, DATABASE_URL };
