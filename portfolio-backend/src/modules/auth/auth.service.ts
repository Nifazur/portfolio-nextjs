/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/db';
import { config } from '../../config';
import { ApiError } from '../../utils/ApiError';
import { validateEmail, validatePassword } from '../../utils/validation';

interface LoginPayload {
  email: string;
  password: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  static async login(payload: LoginPayload): Promise<TokenResponse> {
    const { email, password } = payload;

    // Validation
    if (!email || !validateEmail(email)) {
      throw new ApiError(400, 'Valid email is required');
    }

    if (!password || password.length === 0) {
      throw new ApiError(400, 'Password is required');
    }

    // Find owner
    const owner = await prisma.owner.findUnique({
      where: { email },
    });

    if (!owner) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, owner.password);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: owner.id, email: owner.email, role: owner.role },
      config.jwt.secret as jwt.Secret,
      { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] }
    );

    const refreshToken = jwt.sign(
      { id: owner.id },
      config.jwt.refreshSecret as jwt.Secret,
      { expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'] }
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        role: owner.role,
      },
    };
  }

  static async refreshToken(token: string): Promise<{ accessToken: string }> {
    if (!token) {
      throw new ApiError(401, 'Refresh token is required');
    }

    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret as jwt.Secret) as { id: number };

      const owner = await prisma.owner.findUnique({
        where: { id: decoded.id },
      });

      if (!owner) {
        throw new ApiError(401, 'User not found');
      }

      const accessToken = jwt.sign(
        { id: owner.id, email: owner.email, role: owner.role },
        config.jwt.secret as jwt.Secret,
        { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] }
      );

      return { accessToken };
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  }

  static async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    // Validate passwords
    if (!oldPassword || !newPassword) {
      throw new ApiError(400, 'Both old and new passwords are required');
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      throw new ApiError(400, passwordValidation.message);
    }

    // Find owner
    const owner = await prisma.owner.findUnique({
      where: { id: userId },
    });

    if (!owner) {
      throw new ApiError(404, 'User not found');
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, owner.password);

    if (!isOldPasswordValid) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.owner.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  static async getProfile(userId: number) {
    const owner = await prisma.owner.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        phone: true,
        picture: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!owner) {
      throw new ApiError(404, 'User not found');
    }

    return owner;
  }

  static async updateProfile(
    userId: number,
    data: Partial<{ name: string; bio: string; phone: string; picture: string }>
  ) {
    const { name, bio, phone, picture } = data;

    const owner = await prisma.owner.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(phone && { phone }),
        ...(picture && { picture }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        phone: true,
        picture: true,
        role: true,
      },
    });

    return owner;
  }
}