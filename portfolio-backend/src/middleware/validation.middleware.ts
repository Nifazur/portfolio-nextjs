import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { validateEmail } from '../utils/validation';

export const validateBlogInput = (req: Request, _res: Response, next: NextFunction) => {
  const { title, content, category } = req.body;

  if (!title || title.trim().length === 0) {
    throw new ApiError(400, 'Title is required');
  }

  if (!content || content.trim().length === 0) {
    throw new ApiError(400, 'Content is required');
  }

  if (!category || category.trim().length === 0) {
    throw new ApiError(400, 'Category is required');
  }

  if (title.length < 5) {
    throw new ApiError(400, 'Title must be at least 5 characters long');
  }

  if (content.length < 50) {
    throw new ApiError(400, 'Content must be at least 50 characters long');
  }

  next();
};

export const validateProjectInput = (req: Request, _res: Response, next: NextFunction) => {
  const { title, description, category, technologies } = req.body;

  if (!title || title.trim().length === 0) {
    throw new ApiError(400, 'Title is required');
  }

  if (!description || description.trim().length === 0) {
    throw new ApiError(400, 'Description is required');
  }

  if (!category || category.trim().length === 0) {
    throw new ApiError(400, 'Category is required');
  }

  if (!technologies || !Array.isArray(technologies) || technologies.length === 0) {
    throw new ApiError(400, 'At least one technology is required');
  }

  next();
};

export const validateContactInput = (req: Request, _res: Response, next: NextFunction) => {
  const { name, email, message } = req.body;

  if (!name || name.trim().length === 0) {
    throw new ApiError(400, 'Name is required');
  }

  if (!email || !validateEmail(email)) {
    throw new ApiError(400, 'Valid email is required');
  }

  if (!message || message.trim().length === 0) {
    throw new ApiError(400, 'Message is required');
  }

  if (message.length < 10) {
    throw new ApiError(400, 'Message must be at least 10 characters long');
  }

  next();
};