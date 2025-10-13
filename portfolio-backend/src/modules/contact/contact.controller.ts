import { Response } from 'express';
import { ContactService } from './contact.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth.middleware';

export class ContactController {
  static createMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const message = await ContactService.createMessage(req.body);
    res.status(201).json(new ApiResponse(201, message, 'Message sent successfully'));
  });

  static getAllMessages = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const isRead = req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined;

    const result = await ContactService.getAllMessages(page, limit, isRead);
    res.status(200).json(new ApiResponse(200, result, 'Messages fetched successfully'));
  });

  static getMessageById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const message = await ContactService.getMessageById(parseInt(req.params.id));
    res.status(200).json(new ApiResponse(200, message, 'Message fetched successfully'));
  });

  static markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const message = await ContactService.markAsRead(parseInt(req.params.id));
    res.status(200).json(new ApiResponse(200, message, 'Message marked as read'));
  });

  static deleteMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await ContactService.deleteMessage(parseInt(req.params.id));
    res.status(200).json(new ApiResponse(200, result, 'Message deleted successfully'));
  });

  static getMessageStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const stats = await ContactService.getMessageStats();
    res.status(200).json(new ApiResponse(200, stats, 'Message stats fetched successfully'));
  });
}