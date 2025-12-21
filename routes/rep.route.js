import express from "express";
const router = express.Router();

import { addCommentsToCoachingReport } from "../controllers/rep.controller.js";
import { guard, allowedTo } from "../middlewares/auth.middleware.js";

router.use(guard, allowedTo("MEDICAL_REP"));

// Coaching Reports Routes
router.patch("/coaching-reports/:id", addCommentsToCoachingReport); // untested

// Targets and Dashboard Routes
// router.get("/targets", getTarget); // untested
// router.get("/dashboard");
// router.get("/reports");

export default router;
