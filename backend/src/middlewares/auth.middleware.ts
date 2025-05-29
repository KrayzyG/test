import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/app.config';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'No token provided',
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as jwt.JwtPayload;
    
    // Get user
    const user = await userService.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'User not found',
      });
    }
    
    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'User account is inactive',
      });
    }
    
    // Add user to request
    (req as any).user = {
      id: user.id,
      username: user.username,
      email: user.email,
      is_verified: user.is_verified,
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Token expired',
      });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Invalid token',
      });
    }
    
    next(error);
  }
};
