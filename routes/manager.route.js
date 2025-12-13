import express from "express";
const router = express.Router();

import {
  createUser,
  getAllUsers,
  getUserDetails,
  updateOneUserById,
  deleteOneUserById,
  addNewDoctor,
  getAllDoctors,
  getOneDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/manager.controller.js";
import { guard, allowedTo } from "../middlewares/auth.middleware.js";

router.use(guard, allowedTo("MANAGER"));

// Users CRUD operations
router.post("/users", createUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserDetails);
router.put("/users/:id", updateOneUserById);
router.delete("/users/:id", deleteOneUserById);

// doctor routes
router.get("/doctors", getAllDoctors);
router.post("/doctors", addNewDoctor);
router.patch("/doctors/:id", updateDoctor);
router.delete("/doctors/:id", deleteDoctor);
router.get("/doctors/:id", getOneDoctor);

export default router;
