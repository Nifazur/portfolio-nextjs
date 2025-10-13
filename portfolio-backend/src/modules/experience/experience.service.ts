/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';

export class ExperienceService {
  static async createExperience(data: any) {
    const experience = await prisma.experience.create({ data });
    return experience;
  }

  static async getAllExperiences() {
    const experiences = await prisma.experience.findMany({
      orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
    });
    return experiences;
  }

  static async getExperienceById(id: number) {
    const experience = await prisma.experience.findUnique({ where: { id } });
    if (!experience) throw new ApiError(404, 'Experience not found');
    return experience;
  }

  static async updateExperience(id: number, data: any) {
    const experience = await prisma.experience.findUnique({ where: { id } });
    if (!experience) throw new ApiError(404, 'Experience not found');

    const updated = await prisma.experience.update({ where: { id }, data });
    return updated;
  }

  static async deleteExperience(id: number) {
    const experience = await prisma.experience.findUnique({ where: { id } });
    if (!experience) throw new ApiError(404, 'Experience not found');

    await prisma.experience.delete({ where: { id } });
    return { message: 'Experience deleted successfully' };
  }
}