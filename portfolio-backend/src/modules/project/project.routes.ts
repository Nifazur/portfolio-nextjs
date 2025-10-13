import express from 'express';
import { ProjectController } from './project.controller';
import { authenticate, authorizeOwner } from '../../middleware/auth.middleware';
import { validateProjectInput } from '../../middleware/validation.middleware';

const router = express.Router();

// Public routes
router.get('/', ProjectController.getAllProjects);
router.get('/featured', ProjectController.getFeaturedProjects);
router.get('/categories', ProjectController.getProjectCategories);
router.get('/technologies', ProjectController.getProjectTechnologies);
router.get('/slug/:slug', ProjectController.getProjectBySlug);

// Protected routes (Owner only)
router.use(authenticate);
router.use(authorizeOwner);

router.post('/', validateProjectInput, ProjectController.createProject);
router.get('/stats', ProjectController.getProjectStats);
router.get('/:id', ProjectController.getProjectById);
router.patch('/:id', ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);

export const projectRouter = router;