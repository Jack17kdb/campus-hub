import express from "express";
import protect from '../middleware/protect.js';
import { stkPush, mpesaCallback } from "../controllers/mpesaController.js";

const router = express.Router();

router.post("/pay", protect, stkPush);
router.post("/callback", mpesaCallback);

export default router;
