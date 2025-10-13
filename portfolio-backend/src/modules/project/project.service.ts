/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/project/project.service.ts
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';
import { slugify } from '../../utils/slugify';

interface ProjectQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  technologies?: string[];
  status?: string;
  isFeatured?: boolean;
  sortBy?: 'createdAt' | 'order' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export class ProjectService {
  static async createProject(data: any) {
    const { title, description, thumbnail, images, liveUrl, githubUrl, technologies, category, isFeatured, status, features, order } = data;

    // Generate unique slug
    let slug = slugify(title);
    const existingProject = await prisma.project.findUnique({ where: { slug } });
    
    if (existingProject) {
      slug = `${slug}-${Date.now()}`;
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        thumbnail,
        images: images || [],
        liveUrl,
        githubUrl,
        technologies,
        category,
        isFeatured: isFeatured || false,
        status: status || 'COMPLETED',
        features: features || [],
        order: order || 0,
      },
    });

    return project;
  }

  static async getAllProjects(params: ProjectQueryParams) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      technologies,
      status,
      isFeatured,
      sortBy = 'order',
      sortOrder = 'asc',
    } = params;

    const skip = (page - 1) * limit;

    const where: any = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        } : {},
        category ? { category: { equals: category, mode: 'insensitive' } } : {},
        technologies && technologies.length > 0 ? { technologies: { hasSome: technologies } } : {},
        status ? { status: status as any } : {},
        typeof isFeatured === 'boolean' ? { isFeatured } : {},
      ],
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.project.count({ where }),
    ]);

    return {
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getProjectBySlug(slug: string) {
    const project = await prisma.project.findUnique({
      where: { slug },
    });

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    return project;
  }

  static async getProjectById(id: number) {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    return project;
  }

  static async updateProject(id: number, data: any) {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    // If title is updated, generate new slug
    let slug = project.slug;
    if (data.title && data.title !== project.title) {
      slug = slugify(data.title);
      const existingProject = await prisma.project.findFirst({
        where: { slug, id: { not: id } },
      });
      if (existingProject) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
    });

    return updatedProject;
  }

  static async deleteProject(id: number) {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    await prisma.project.delete({ where: { id } });

    return { message: 'Project deleted successfully' };
  }

  static async getFeaturedProjects(limit = 6) {
    const projects = await prisma.project.findMany({
      where: { isFeatured: true },
      take: limit,
      orderBy: { order: 'asc' },
    });

    return projects;
  }

  static async getProjectCategories() {
    const categories = await prisma.project.groupBy({
      by: ['category'],
      _count: { category: true },
    });

    return categories.map((cat: { category: string; _count: { category: number } }) => ({
      name: cat.category,
      count: cat._count.category,
    }));
  }

  static async getProjectTechnologies() {
    const projects = await prisma.project.findMany({
      select: { technologies: true },
    });

    const allTechs = projects.flatMap((project: { technologies: string[] }) => project.technologies);
    const techCounts = allTechs.reduce((acc: Record<string, number>, tech: string) => {
      acc[tech] = (acc[tech] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(techCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a: any, b: any) => b.count - a.count);
  }

  static async getProjectStats() {
    const [totalProjects, completedProjects, inProgressProjects, featuredProjects] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'COMPLETED' } }),
      prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.project.count({ where: { isFeatured: true } }),
    ]);

    return {
      totalProjects,
      completedProjects,
      inProgressProjects,
      featuredProjects,
    };
  }
}