import express from 'express';
import protect from '../middleware/protect.js';
import { createItemValidator, searchValidator, mongoIdValidator } from '../middleware/validators.js';
import itemController from '../controllers/itemController.js';

const router = express.Router();

router.post('/create', protect, createItemValidator, itemController.createItem);
router.get('/items', protect, itemController.getItems);
router.get('/search', protect, searchValidator, itemController.searchItems);
router.get('/:id', protect, mongoIdValidator, itemController.getItemById);
router.put('/:id/status', protect, mongoIdValidator, itemController.updateItemStatus);
router.delete('/:id', protect, mongoIdValidator, itemController.deleteItem);

export default router;
