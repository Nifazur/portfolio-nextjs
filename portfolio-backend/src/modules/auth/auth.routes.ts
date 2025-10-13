import express from 'express';
import { AuthController } from './auth.controller';
import { authenticate, authorizeOwner } from '../../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);

// Protected routes
router.use(authenticate);
router.use(authorizeOwner);

router.post('/logout', AuthController.logout);
router.post('/change-password', AuthController.changePassword);
router.get('/profile', AuthController.getProfile);
router.patch('/profile', AuthController.updateProfile);

export const authRouter = router;