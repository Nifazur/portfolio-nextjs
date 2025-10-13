import express from 'express';
import { ExperienceController } from './experience.controller';
import { authenticate, authorizeOwner } from '../../middleware/auth.middleware';

const router = express.Router();

router.get('/', ExperienceController.getAllExperiences);
router.get('/:id', ExperienceController.getExperienceById);

router.use(authenticate);
router.use(authorizeOwner);
router.post('/', ExperienceController.createExperience);
router.patch('/:id', ExperienceController.updateExperience);
router.delete('/:id', ExperienceController.deleteExperience);

export const experienceRouter = router;