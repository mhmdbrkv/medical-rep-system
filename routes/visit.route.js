import express from "express";
const router = express.Router();

import {
  scheduleVisit,
  getVisits,
  addVisitReports,
  getAllVisitReports,
} from "../controllers/visit.controller.js";
import { guard } from "../middlewares/auth.middleware.js";

router.use(guard);

// Visits and Visit Reports Routes
router.post("/", scheduleVisit);
router.get("/", getVisits);
router.post("/visit-reports", addVisitReports);
router.get("/visit-reports", getAllVisitReports);

export default router;
