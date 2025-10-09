import express from "express";
const router = express.Router();

import { guard, allowedTo } from "../middlewares/auth.middleware.js";
import { createUser } from "../controllers/manager.controller.js";

router.post("/users", guard, allowedTo("MANAGER"), createUser);

export default router;
