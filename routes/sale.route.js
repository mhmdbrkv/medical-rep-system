import express from "express";

import { addSale, getAllSales } from "../controllers/sales.controller.js";
import { sheetUpload } from "../utils/multer.js";
import { guard, allowedTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(guard, allowedTo("MANAGER"));

router.get("/", getAllSales);
router.post("/", sheetUpload, addSale);

export default router;
