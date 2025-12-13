import express from "express";
const router = express.Router();

import {
  addNewDoctor,
  getAllDoctors,
  getOneDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller.js";
import { guard, allowedTo } from "../middlewares/auth.middleware.js";

router.use(guard);

router.get("/doctors", getAllDoctors);
router.post("/doctors", allowedTo("MANAGER"), addNewDoctor);
router.get("/doctors/:id", getOneDoctor);
router.patch("/doctors/:id", allowedTo("MANAGER"), updateDoctor);
router.delete("/doctors/:id", allowedTo("MANAGER"), deleteDoctor);

export default router;
