/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { ProjectService } from './project.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth.middleware';

export class ProjectController {
  static createProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const project = await ProjectService.createProject(req.body);
    res.status(201).json(new ApiResponse(201, project, 'Project created successfully'));
  });

  static getAllProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
    const params = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      category: req.query.category as string,
      technologies: req.query.technologies ? (req.query.technologies as string).split(',') : undefined,
      status: req.query.status as string,
      isFeatured: req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined,
      sortBy: (req.query.sortBy as any) || 'order',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
    };

    const result = await ProjectService.getAllProjects(params);
    res.status(200).json(new ApiResponse(200, result, 'Projects fetched successfully'));
  });

  static getProjectBySlug = asyncHandler(async (req: AuthRequest, res: Response) => {
    const project = await ProjectService.getProjectBySlug(req.params.slug);
    res.status(200).json(new ApiResponse(200, project, 'Project fetched successfully'));
  });

  static getProjectById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const project = await ProjectService.getProjectById(parseInt(req.params.id));
    res.status(200).json(new ApiResponse(200, project, 'Project fetched successfully'));
  });

  static updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const project = await ProjectService.updateProject(parseInt(req.params.id), req.body);
    res.status(200).json(new ApiResponse(200, project, 'Project updated successfully'));
  });

  static deleteProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await ProjectService.deleteProject(parseInt(req.params.id));
    res.status(200).json(new ApiResponse(200, result, 'Project deleted successfully'));
  });

  static getFeaturedProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 6;
    const projects = await ProjectService.getFeaturedProjects(limit);
    res.status(200).json(new ApiResponse(200, projects, 'Featured projects fetched successfully'));
  });

  static getProjectCategories = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const categories = await ProjectService.getProjectCategories();
    res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully'));
  });

  static getProjectTechnologies = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const technologies = await ProjectService.getProjectTechnologies();
    res.status(200).json(new ApiResponse(200, technologies, 'Technologies fetched successfully'));
  });

  static getProjectStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const stats = await ProjectService.getProjectStats();
    res.status(200).json(new ApiResponse(200, stats, 'Project stats fetched successfully'));
  });
}