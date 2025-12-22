import express from "express";
const router = express.Router();

import { guard, allowedTo } from "../middlewares/auth.middleware.js";

router.use(guard);

export default router;
