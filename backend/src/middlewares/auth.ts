import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { AppError } from './errorHandler';

export interface AdminPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminPayload;
}

export const authenticateAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized: Access token is missing or malformed', 401);
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'problempulse_super_secret_jwt_key_2026_cs_major_project';

    const decoded = jwt.verify(token, secret) as AdminPayload;

    // Verify user still exists in database
    const user = await prisma.adminUser.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, name: true },
    });

    if (!user) {
      throw new AppError('Unauthorized: Administrator account no longer exists', 401);
    }

    req.admin = user;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(new AppError('Unauthorized: Invalid or expired session token', 401));
    } else {
      next(error);
    }
  }
};
