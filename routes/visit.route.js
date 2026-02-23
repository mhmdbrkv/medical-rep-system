import express from "express";
const router = express.Router();

import {
  scheduleVisit,
  getVisits,
  addVisitReports,
  getAllVisitReports,
  getMyVisitReports,
} from "../controllers/visit.controller.js";
import { guard, allowedTo } from "../middlewares/auth.middleware.js";

router.use(guard);

// Visits and Visit Reports Routes
router.post("/", scheduleVisit);
router.get("/", getVisits);
router.post("/visit-reports", addVisitReports);
router.get("/visit-reports", getMyVisitReports);
router.get("/visit-reports", getMyVisitReports);
router.get(
  "/all-visit-reports",
  allowedTo("MANAGER", "SUPERVISOR"),
  getAllVisitReports,
);

export default router;
