import express from 'express';
import protect from '../middleware/protect.js';
import authController from '../controllers/authController.js';
import { registerValidator, loginValidator, resetPasswordValidator, forgotPasswordValidator, mongoIdValidator } from '../middleware/validators.js'

const router = express.Router();

router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password', forgotPasswordValidator, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidator, authController.resetPassword);
router.get('/logout', protect, authController.logout);
router.put('/update-pic', protect, authController.updatePic);
router.delete('/delete-account', protect, authController.deleteAccount);
router.get('/checkAuth', protect, authController.checkAuth);
router.get('/:id', protect, mongoIdValidator, authController.getUserById);

export default router;
