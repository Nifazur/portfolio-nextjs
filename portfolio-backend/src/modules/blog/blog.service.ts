/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';
import { slugify } from '../../utils/slugify';

interface BlogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tags?: string[];
  isPublished?: boolean;
  isFeatured?: boolean;
  sortBy?: 'createdAt' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export class BlogService {
  static async createBlog(authorId: number, data: any) {
    const { title, content, excerpt, thumbnail, category, tags, isPublished, isFeatured, readTime } = data;

    // Generate unique slug
    let slug = slugify(title);
    const existingBlog = await prisma.blog.findUnique({ where: { slug } });
    
    if (existingBlog) {
      slug = `${slug}-${Date.now()}`;
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 150),
        thumbnail,
        category,
        tags: tags || [],
        isPublished: isPublished || false,
        isFeatured: isFeatured || false,
        readTime: readTime || Math.ceil(content.split(' ').length / 200),
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
    });

    return blog;
  }

  static async getAllBlogs(params: BlogQueryParams) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      tags,
      isPublished,
      isFeatured,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    const where: any = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
            { excerpt: { contains: search, mode: 'insensitive' } },
          ],
        } : {},
        category ? { category: { equals: category, mode: 'insensitive' } } : {},
        tags && tags.length > 0 ? { tags: { hasSome: tags } } : {},
        typeof isPublished === 'boolean' ? { isPublished } : {},
        typeof isFeatured === 'boolean' ? { isFeatured } : {},
      ],
    };

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              picture: true,
            },
          },
        },
      }),
      prisma.blog.count({ where }),
    ]);

    return {
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getBlogBySlug(slug: string, incrementView = false) {
    if (incrementView) {
      await prisma.blog.update({
        where: { slug },
        data: { views: { increment: 1 } },
      });
    }

    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
            bio: true,
          },
        },
      },
    });

    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    return blog;
  }

  static async getBlogById(id: number) {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
    });

    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    return blog;
  }

  static async updateBlog(id: number, data: any) {
    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    // If title is updated, generate new slug
    let slug = blog.slug;
    if (data.title && data.title !== blog.title) {
      slug = slugify(data.title);
      const existingBlog = await prisma.blog.findFirst({
        where: { slug, id: { not: id } },
      });
      if (existingBlog) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        ...data,
        slug,
        ...(data.content && {
          readTime: Math.ceil(data.content.split(' ').length / 200),
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
    });

    return updatedBlog;
  }

  static async deleteBlog(id: number) {
    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    await prisma.blog.delete({ where: { id } });

    return { message: 'Blog deleted successfully' };
  }

  static async getFeaturedBlogs(limit = 5) {
    const blogs = await prisma.blog.findMany({
      where: {
        isPublished: true,
        isFeatured: true,
      },
      take: limit,
      orderBy: { views: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            picture: true,
          },
        },
      },
    });

    return blogs;
  }

  static async getBlogCategories() {
    const categories = await prisma.blog.groupBy({
      by: ['category'],
      where: { isPublished: true },
      _count: { category: true },
    });

    return categories.map((cat: { category: string; _count: { category: number } }) => ({
      name: cat.category,
      count: cat._count.category,
    }));
  }

  static async getBlogTags() {
    const blogs = await prisma.blog.findMany({
      where: { isPublished: true },
      select: { tags: true },
    });

    const allTags = blogs.flatMap((blog: { tags: string[] }) => blog.tags);
    const tagCounts = allTags.reduce((acc: Record<string, number>, tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => (b.count as number) - (a.count as number));
  }

  static async getBlogStats() {
    const [totalBlogs, publishedBlogs, draftBlogs, totalViews, featuredBlogs] = await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({ where: { isPublished: true } }),
      prisma.blog.count({ where: { isPublished: false } }),
      prisma.blog.aggregate({ _sum: { views: true } }),
      prisma.blog.count({ where: { isFeatured: true, isPublished: true } }),
    ]);

    return {
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalViews: totalViews._sum.views || 0,
      featuredBlogs,
    };
  }
}