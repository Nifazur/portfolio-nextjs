import { Response } from 'express';
import { SkillService } from './skill.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth.middleware';

export class SkillController {
  static createSkill = asyncHandler(async (req: AuthRequest, res: Response) => {
    const skill = await SkillService.createSkill(req.body);
    res.status(201).json(new ApiResponse(201, skill, 'Skill created successfully'));
  });

  static getAllSkills = asyncHandler(async (req: AuthRequest, res: Response) => {
    const category = req.query.category as string;
    const skills = await SkillService.getAllSkills(category);
    res.status(200).json(new ApiResponse(200, skills, 'Skills fetched successfully'));
  });

  static getSkillsByCategory = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const skills = await SkillService.getSkillsByCategory();
    res.status(200).json(new ApiResponse(200, skills, 'Skills by category fetched successfully'));
  });

  static updateSkill = asyncHandler(async (req: AuthRequest, res: Response) => {
    const skill = await SkillService.updateSkill(parseInt(req.params.id), req.body);
    res.status(200).json(new ApiResponse(200, skill, 'Skill updated successfully'));
  });

  static deleteSkill = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await SkillService.deleteSkill(parseInt(req.params.id));
    res.status(200).json(new ApiResponse(200, result, 'Skill deleted successfully'));
  });
}