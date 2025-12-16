import express from "express";
const router = express.Router();

import {
  getProfile,
  updateProfile,
} from "../controllers/profile.controller.js";
import { guard } from "../middlewares/auth.middleware.js";

router.use(guard);

// Profile Routes
router.get("/", getProfile);
router.patch("/", updateProfile);

export default router;
