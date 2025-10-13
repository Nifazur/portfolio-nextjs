/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';

export class ContactService {
  static async createMessage(data: any) {
    const message = await prisma.contactMessage.create({ data });
    return message;
  }

  static async getAllMessages(page = 1, limit = 10, isRead?: boolean) {
    const skip = (page - 1) * limit;
    const where = typeof isRead === 'boolean' ? { isRead } : {};

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return {
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getMessageById(id: number) {
    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (!message) throw new ApiError(404, 'Message not found');
    return message;
  }

  static async markAsRead(id: number) {
    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (!message) throw new ApiError(404, 'Message not found');

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
    return updated;
  }

  static async deleteMessage(id: number) {
    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (!message) throw new ApiError(404, 'Message not found');

    await prisma.contactMessage.delete({ where: { id } });
    return { message: 'Contact message deleted successfully' };
  }

  static async getMessageStats() {
    const [total, unread] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

    return { total, unread, read: total - unread };
  }
}