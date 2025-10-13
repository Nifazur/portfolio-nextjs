import express from 'express';
import { EducationController } from './education.controller';
import { authenticate, authorizeOwner } from '../../middleware/auth.middleware';

const router = express.Router();

router.get('/', EducationController.getAllEducations);
router.get('/:id', EducationController.getEducationById);

router.use(authenticate);
router.use(authorizeOwner);
router.post('/', EducationController.createEducation);
router.patch('/:id', EducationController.updateEducation);
router.delete('/:id', EducationController.deleteEducation);

export const educationRouter = router;