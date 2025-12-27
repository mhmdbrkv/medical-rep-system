import express from "express";
const router = express.Router();

import {
  addHospital,
  getAllHospitals,
} from "../controllers/hospital.controller.js";
import { guard, allowedTo } from "../middlewares/auth.middleware.js";

router.use(guard);

router.get("/", getAllHospitals);
router.post("/", allowedTo("MANAGER"), addHospital);

export default router;
