import express from "express";
const router = express.Router();

import {
  getProfile,
  updateProfile,
  createPlan,
  getAllPlans,
  scheduleVisit,
  getVisits,
  addVisitReports,
} from "../controllers/rep.controller.js";
import { guard } from "../middlewares/auth.middleware.js";

router.use(guard);

// Profile Routes
router.get("/profile/:id", getProfile);
router.patch("/profile/:id", updateProfile);

router.post("/plans", createPlan);
router.get("/plans", getAllPlans);

router.post("/visits", scheduleVisit);
router.get("/visits", getVisits);
router.post("/visit-reports", addVisitReports);

// router.get("/dashboard");
// router.get("/targets");
// router.get("/requests");
// router.get("/reports");
// router.get("/coaching-reports");

export default router;
