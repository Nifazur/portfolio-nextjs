/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';

export class SkillService {
  static async createSkill(data: any) {
    const skill = await prisma.skill.create({ data });
    return skill;
  }

  static async getAllSkills(category?: string) {
    const where = category ? { category: category as any } : {};
    const skills = await prisma.skill.findMany({
      where,
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });
    return skills;
  }

  static async getSkillsByCategory() {
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });

    const grouped = skills.reduce((acc: Record<string, any[]>, skill: { category: string }) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});

    return grouped;
  }

  static async updateSkill(id: number, data: any) {
    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new ApiError(404, 'Skill not found');

    const updated = await prisma.skill.update({ where: { id }, data });
    return updated;
  }

  static async deleteSkill(id: number) {
    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new ApiError(404, 'Skill not found');

    await prisma.skill.delete({ where: { id } });
    return { message: 'Skill deleted successfully' };
  }
}