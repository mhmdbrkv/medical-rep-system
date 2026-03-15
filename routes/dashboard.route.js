import express from "express";
const router = express.Router();

import { guard, allowedTo } from "../middlewares/auth.middleware.js";

import {
  getRepsDashboard,
  getManagersDashboard,
  getRepsSales,
  getAllSales,
} from "../controllers/dashboard.controller.js";

router.use(guard);

// Dashboard route
router.get("/sales", allowedTo("MANAGER"), getAllSales);
router.get("/reps", allowedTo("MEDICAL_REP"), getRepsDashboard);
router.get("/reps/sales", allowedTo("MEDICAL_REP"), getRepsSales);
router.get("/managers", allowedTo("MANAGER"), getManagersDashboard);

export default router;
