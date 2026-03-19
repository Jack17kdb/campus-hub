import express from 'express';
import protect from '../middleware/protect.js';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.get('/filter', protect, paymentController.filterPayments);
router.get('/:id', protect, paymentController.getPayment);
router.get('/type/:type', protect, paymentController.getPaymentsByType);

export default router;
