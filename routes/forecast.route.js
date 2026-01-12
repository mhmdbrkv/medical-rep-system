import express from "express";
const router = express.Router();

import {
  createForecast,
  getForecasts,
} from "../controllers/forecast.controller.js";
import { guard, allowedTo } from "../middlewares/auth.middleware.js";

router.use(guard);

router.post("/", allowedTo("MEDICAL_REP"), createForecast);
router.get("/", allowedTo("MEDICAL_REP"), getForecasts);

export default router;
