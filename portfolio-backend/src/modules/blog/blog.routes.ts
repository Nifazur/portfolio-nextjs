import express from 'express';
import { BlogController } from './blog.controller';
import { authenticate, authorizeOwner } from '../../middleware/auth.middleware';
import { validateBlogInput } from '../../middleware/validation.middleware';

const router = express.Router();

// Public routes
router.get('/', BlogController.getAllBlogs);
router.get('/featured', BlogController.getFeaturedBlogs);
router.get('/categories', BlogController.getBlogCategories);
router.get('/tags', BlogController.getBlogTags);
router.get('/slug/:slug', BlogController.getBlogBySlug);

// Protected routes (Owner only)
router.use(authenticate);
router.use(authorizeOwner);

router.post('/', validateBlogInput, BlogController.createBlog);
router.get('/stats', BlogController.getBlogStats);
router.get('/:id', BlogController.getBlogById);
router.patch('/:id', BlogController.updateBlog);
router.delete('/:id', BlogController.deleteBlog);

export const blogRouter = router;