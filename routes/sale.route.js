import express from "express";

import { addSale, getAllSales } from "../controllers/sales.controller.js";

const router = express.Router();

import { guard, allowedTo } from "../middlewares/auth.middleware.js";

router.use(guard);

router.route("/").post(allowedTo("MANAGER"), addSale).get(getAllSales);

export default router;
