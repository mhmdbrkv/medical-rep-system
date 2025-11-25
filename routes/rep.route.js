import express from "express";
const router = express.Router();

import { getProfile, updateProfile } from "../controllers/rep.controller.js";
import { guard, allowedTo } from "../middlewares/auth.middleware.js";
import { selfMiddleware } from "../middlewares/self.middleware.js";

router.use(guard, allowedTo("MEDICAL_REP"));

// Profile Routes
router.get("/profile/:id", selfMiddleware, getProfile);
router.patch("/profile/:id", selfMiddleware, updateProfile);

// router.get("/dashboard");
// router.post("/plans");
// router.get("/plans");
// router.get("/targets");
// router.get("/requests");
// router.get("/reports");
// router.get("/visits");
// router.post("/visits");
// router.get("/visit-reports");
// router.get("/coaching-reports");

export default router;
