import { Response } from 'express';
import { EducationService } from './education.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth.middleware';

export class EducationController {
  static createEducation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const education = await EducationService.createEducation(req.body);
    res.status(201).json(new ApiResponse(201, education, 'Education created successfully'));
  });

  static getAllEducations = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const educations = await EducationService.getAllEducations();
    res.status(200).json(new ApiResponse(200, educations, 'Educations fetched successfully'));
  });

  static getEducationById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const education = await EducationService.getEducationById(parseInt(req.params.id));
    res.status(200).json(new ApiResponse(200, education, 'Education fetched successfully'));
  });

  static updateEducation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const education = await EducationService.updateEducation(parseInt(req.params.id), req.body);
    res.status(200).json(new ApiResponse(200, education, 'Education updated successfully'));
  });

  static deleteEducation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await EducationService.deleteEducation(parseInt(req.params.id));
    res.status(200).json(new ApiResponse(200, result, 'Education deleted successfully'));
  });
}