import { Response } from 'express';
import { ExperienceService } from './experience.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth.middleware';

export class ExperienceController {
  static createExperience = asyncHandler(async (req: AuthRequest, res: Response) => {
    const experience = await ExperienceService.createExperience(req.body);
    res.status(201).json(new ApiResponse(201, experience, 'Experience created successfully'));
  });

  static getAllExperiences = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const experiences = await ExperienceService.getAllExperiences();
    res.status(200).json(new ApiResponse(200, experiences, 'Experiences fetched successfully'));
  });

  static getExperienceById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const experience = await ExperienceService.getExperienceById(parseInt(req.params.id));
    res.status(200).json(new ApiResponse(200, experience, 'Experience fetched successfully'));
  });

  static updateExperience = asyncHandler(async (req: AuthRequest, res: Response) => {
    const experience = await ExperienceService.updateExperience(parseInt(req.params.id), req.body);
    res.status(200).json(new ApiResponse(200, experience, 'Experience updated successfully'));
  });

  static deleteExperience = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await ExperienceService.deleteExperience(parseInt(req.params.id));
    res.status(200).json(new ApiResponse(200, result, 'Experience deleted successfully'));
  });
}