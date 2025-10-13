/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';

export class EducationService {
  static async createEducation(data: any) {
    const education = await prisma.education.create({ data });
    return education;
  }

  static async getAllEducations() {
    const educations = await prisma.education.findMany({
      orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
    });
    return educations;
  }

  static async getEducationById(id: number) {
    const education = await prisma.education.findUnique({ where: { id } });
    if (!education) throw new ApiError(404, 'Education not found');
    return education;
  }

  static async updateEducation(id: number, data: any) {
    const education = await prisma.education.findUnique({ where: { id } });
    if (!education) throw new ApiError(404, 'Education not found');

    const updated = await prisma.education.update({ where: { id }, data });
    return updated;
  }

  static async deleteEducation(id: number) {
    const education = await prisma.education.findUnique({ where: { id } });
    if (!education) throw new ApiError(404, 'Education not found');

    await prisma.education.delete({ where: { id } });
    return { message: 'Education deleted successfully' };
  }
}