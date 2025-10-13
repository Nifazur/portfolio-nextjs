/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { BlogService } from './blog.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth.middleware';

export class BlogController {
  static createBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const userId = req.user.id;
    const blog = await BlogService.createBlog(userId, req.body);
    res.status(201).json(new ApiResponse(201, blog, 'Blog created successfully'));
  });

  static getAllBlogs = asyncHandler(async (req: AuthRequest, res: Response) => {
    const params = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      category: req.query.category as string,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      isPublished: req.query.isPublished === 'true' ? true : req.query.isPublished === 'false' ? false : undefined,
      isFeatured: req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined,
      sortBy: (req.query.sortBy as any) || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await BlogService.getAllBlogs(params);
    res.status(200).json(new ApiResponse(200, result, 'Blogs fetched successfully'));
  });

  static getBlogBySlug = asyncHandler(async (req: AuthRequest, res: Response) => {
    const blog = await BlogService.getBlogBySlug(req.params.slug, true);
    res.status(200).json(new ApiResponse(200, blog, 'Blog fetched successfully'));
  });

  static getBlogById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const blog = await BlogService.getBlogById(parseInt(req.params.id));
    res.status(200).json(new ApiResponse(200, blog, 'Blog fetched successfully'));
  });

  static updateBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
    const blog = await BlogService.updateBlog(parseInt(req.params.id), req.body);
    res.status(200).json(new ApiResponse(200, blog, 'Blog updated successfully'));
  });

  static deleteBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await BlogService.deleteBlog(parseInt(req.params.id));
    res.status(200).json(new ApiResponse(200, result, 'Blog deleted successfully'));
  });

  static getFeaturedBlogs = asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 5;
    const blogs = await BlogService.getFeaturedBlogs(limit);
    res.status(200).json(new ApiResponse(200, blogs, 'Featured blogs fetched successfully'));
  });

  static getBlogCategories = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const categories = await BlogService.getBlogCategories();
    res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully'));
  });

  static getBlogTags = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const tags = await BlogService.getBlogTags();
    res.status(200).json(new ApiResponse(200, tags, 'Tags fetched successfully'));
  });

  static getBlogStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const stats = await BlogService.getBlogStats();
    res.status(200).json(new ApiResponse(200, stats, 'Blog stats fetched successfully'));
  });
}