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
  getAllVisitReports,
  getAllRequests,
  createRequest,
  updateRequest,
  getOnePlan,
  addCommentsToCoachingReport,
} from "../controllers/rep.controller.js";
import { guard } from "../middlewares/auth.middleware.js";

router.use(guard);

// Profile Routes
router.get("/profile", getProfile);
router.patch("/profile", updateProfile);

// Plans Routes
router.post("/plans", createPlan);
router.get("/plans", getAllPlans);
router.get("/plans/:id", getOnePlan);

// Visits and Visit Reports Routes
router.post("/visits", scheduleVisit);
router.get("/visits", getVisits);
router.post("/visit-reports", addVisitReports);
router.get("/visit-reports", getAllVisitReports);

// Requests Routes
router.get("/requests", getAllRequests);
router.post("/requests", createRequest);
router.patch("/requests/:id", updateRequest);

// Coaching Reports Routes
router.patch("/coaching-reports/:id", addCommentsToCoachingReport); // untested

// Targets and Dashboard Routes
// router.get("/targets", getTarget); // untested
// router.get("/dashboard");
// router.get("/reports");

export default router;
