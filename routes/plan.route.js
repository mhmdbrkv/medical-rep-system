import express from "express";
const router = express.Router();

import {
  createPlan,
  getAllPlans,
  getOnePlan,
  getPlansMGMT,
} from "../controllers/plan.controller.js";
import { guard, allowedTo } from "../middlewares/auth.middleware.js";

router.use(guard);

// Plans Routes
router.post("/", createPlan);
router.get("/", getAllPlans);
router.get("/mgmt", allowedTo("SUPERVISOR"), getPlansMGMT);
router.get("/:id", getOnePlan);

export default router;
