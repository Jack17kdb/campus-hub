import express from 'express';
import protect from '../middleware/protect.js';
import aiController from "../controllers/aiController.js";

const router = express.Router();

router.post('/', protect, aiController.agent);

export default router;
