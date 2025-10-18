/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../config/db';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = 
      req.cookies?.token || 
      req.headers.authorization?.replace('Bearer ', '') ||
      req.headers.authorization;

    console.log('🔐 Auth Check:', {
      hasCookie: !!req.cookies?.token,
      hasHeader: !!req.headers.authorization,
      token: token ? `${token.substring(0, 20)}...` : 'none'
    });

    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: number;
      email: string;
      role: string;
    };

    const user = await prisma.owner.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, name: true },
    });

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired'));
    }
    next(error);
  }
};

export const authorizeOwner = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required'));
  }

  if (req.user.role !== 'OWNER' && req.user.role !== 'ADMIN') {
    return next(new ApiError(403, 'Access denied. Owner privileges required.'));
  }

  next();
};