import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth.middleware';

export class AuthController {
  static login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await AuthService.login(req.body);

    // Set httpOnly cookies
    res.cookie('token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json(
      new ApiResponse(200, result, 'Login successful')
    );
  });

  static logout = asyncHandler(async (_req: AuthRequest, res: Response) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');

    res.status(200).json(
      new ApiResponse(200, null, 'Logout successful')
    );
  });

  static refreshToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    const result = await AuthService.refreshToken(refreshToken);

    res.cookie('token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(
      new ApiResponse(200, result, 'Token refreshed successfully')
    );
  });

  static changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const userId = req.user.id;
    await AuthService.changePassword(userId, oldPassword, newPassword);

    res.status(200).json(
      new ApiResponse(200, null, 'Password changed successfully')
    );
  });

  static getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const userId = req.user.id;
    const profile = await AuthService.getProfile(userId);

    res.status(200).json(
      new ApiResponse(200, profile, 'Profile fetched successfully')
    );
  });

  static updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const userId = req.user.id;
    const profile = await AuthService.updateProfile(userId, req.body);

    res.status(200).json(
      new ApiResponse(200, profile, 'Profile updated successfully')
    );
  });
}