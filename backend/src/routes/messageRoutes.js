import express from 'express';
import protect from '../middleware/protect.js';
import { sendMessageValidator, mongoIdValidator } from '../middleware/validators.js';
import chatController from '../controllers/chatController.js';

const router = express.Router();

router.get('/getchatusers', protect, chatController.getChatUsers);
router.get('/getmessages/:id', protect, mongoIdValidator, chatController.getMessages);
router.post('/sendmessages/:id', protect, sendMessageValidator, chatController.sendMessages);
router.delete('/deletemessages/:id', protect, mongoIdValidator, chatController.deleteMessage);

export default router;