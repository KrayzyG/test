import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/app.config';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

const userService = new UserService();
const authService = new AuthService();

export class AuthController {
  /**
   * Register a new user
   */
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, phone, password } = req.body;
      
      // Check if user already exists
      const existingUser = await userService.findByEmailOrUsername(email, username);
      if (existingUser) {
        return res.status(409).json({
          status: 'error',
          code: 409,
          message: 'User already exists with this email or username',
        });
      }
      
      // Create new user
      const user = await authService.register({
        username,
        email,
        phone,
        password,
      });
      
      // Generate tokens
      const { accessToken, refreshToken } = await authService.generateTokens(user);
      
      return res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            profile_image: user.profile_image,
            is_verified: user.is_verified,
          },
          tokens: {
            access_token: accessToken,
            refresh_token: refreshToken,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Login user
   */
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      
      // Authenticate user
      const user = await authService.authenticate(email, password);
      if (!user) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Invalid credentials',
        });
      }
      
      // Update last login
      await userService.updateLastLogin(user.id);
      
      // Generate tokens
      const { accessToken, refreshToken } = await authService.generateTokens(user);
      
      return res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            profile_image: user.profile_image,
            is_verified: user.is_verified,
          },
          tokens: {
            access_token: accessToken,
            refresh_token: refreshToken,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Refresh token
   */
  public async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = req.body;
      
      if (!refresh_token) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Refresh token is required',
        });
      }
      
      // Verify refresh token
      const { accessToken, refreshToken, user } = await authService.refreshToken(refresh_token);
      
      return res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            profile_image: user.profile_image,
            is_verified: user.is_verified,
          },
          tokens: {
            access_token: accessToken,
            refresh_token: refreshToken,
          },
        },
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Refresh token expired',
        });
      }
      
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Invalid refresh token',
        });
      }
      
      next(error);
    }
  }
  
  /**
   * Request password reset
   */
  public async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      
      await authService.requestPasswordReset(email);
      
      // Always return success to prevent email enumeration
      return res.status(200).json({
        status: 'success',
        message: 'If an account with that email exists, a password reset link has been sent',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Reset password
   */
  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;
      
      const success = await authService.resetPassword(token, password);
      
      if (!success) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Invalid or expired token',
        });
      }
      
      return res.status(200).json({
        status: 'success',
        message: 'Password has been reset successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Verify email
   */
  public async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      
      const success = await authService.verifyEmail(token);
      
      if (!success) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Invalid or expired token',
        });
      }
      
      return res.status(200).json({
        status: 'success',
        message: 'Email verified successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Logout
   */
  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // In a stateless JWT auth system, we don't need to do anything server-side
      // The client should remove the tokens
      
      return res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
