import express from 'express';
import { ContactController } from './contact.controller';
import { authenticate, authorizeOwner } from '../../middleware/auth.middleware';
import { validateContactInput } from '../../middleware/validation.middleware';

const router = express.Router();

// Public route
router.post('/', validateContactInput, ContactController.createMessage);

// Protected routes (Owner only)
router.use(authenticate);
router.use(authorizeOwner);
router.get('/', ContactController.getAllMessages);
router.get('/stats', ContactController.getMessageStats);
router.get('/:id', ContactController.getMessageById);
router.patch('/:id/read', ContactController.markAsRead);
router.delete('/:id', ContactController.deleteMessage);

export const contactRouter = router;