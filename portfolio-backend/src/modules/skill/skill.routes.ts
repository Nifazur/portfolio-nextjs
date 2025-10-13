import express from 'express';
import { SkillController } from './skill.controller';
import { authenticate, authorizeOwner } from '../../middleware/auth.middleware';

const router = express.Router();

router.get('/', SkillController.getAllSkills);
router.get('/by-category', SkillController.getSkillsByCategory);

router.use(authenticate);
router.use(authorizeOwner);
router.post('/', SkillController.createSkill);
router.patch('/:id', SkillController.updateSkill);
router.delete('/:id', SkillController.deleteSkill);

export const skillRouter = router;