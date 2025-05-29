import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/app.config'; // Keep for token errors, config access
// import { UserService } from '../services/user.service'; // Commented out
import { AuthService } from '../services/auth.service';

// const userService = new UserService(); // Commented out
const authService = new AuthService(); // Instantiates the placeholder service

export class AuthController {
  /**
   * Register a new user (Using Placeholder Service)
   */
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, phone, password } = req.body;

      // Placeholder: Simulate check if user already exists
      // In a real app, this would be `await userService.findByEmailOrUsername(email, username);`
      // For placeholder, we can hardcode a conflict or assume new user for simplicity.
      // Let's assume for placeholder, registration always "succeeds" unless specific mock email is used.
      if (email === 'existing@example.com') {
        return res.status(409).json({
          status: 'error',
          code: 409,
          message: 'User already exists with this email or username (placeholder)',
        });
      }

      // Create new user using placeholder service
      const user = await authService.register({
        username,
        email,
        phone,
        password,
      });

      // Generate tokens using placeholder service (token generation logic might be real)
      const { accessToken, refreshToken } = await authService.generateTokens(user);

      return res.status(201).json({
        status: 'success',
        data: {
          user: { // Return mock user data
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            profile_image: user.profile_image || null, // Ensure all fields expected by frontend are present
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
   * Login user (Using Placeholder Service)
   */
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Authenticate user using placeholder service
      const user = await authService.authenticate(email, password);
      if (!user) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Invalid credentials (placeholder)',
        });
      }

      // Placeholder: Simulate update last login
      // await userService.updateLastLogin(user.id); // Original logic
      console.log(`[AuthController.login] Placeholder: Simulating updateLastLogin for user ID ${user.id}`);


      // Generate tokens using placeholder service
      const { accessToken, refreshToken } = await authService.generateTokens(user);

      return res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone || null,
            profile_image: user.profile_image || null,
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
   * Refresh token (Using Placeholder Service)
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

      // Verify refresh token using placeholder service
      const { accessToken, refreshToken, user } = await authService.refreshToken(refresh_token);

      return res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone || null,
            profile_image: user.profile_image || null,
            is_verified: user.is_verified,
          },
          tokens: {
            access_token: accessToken,
            refresh_token: refreshToken,
          },
        },
      });
    } catch (error: any) { // Added type any for error
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
      // For placeholder, other errors from authService.refreshToken might be generic
      if (error.message === 'Invalid refresh token (placeholder)') {
         return res.status(401).json({
          status: 'error',
          code: 401,
          message: error.message,
        });
      }

      next(error);
    }
  }

  /**
   * Request password reset (Using Placeholder Service)
   */
  public async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      await authService.requestPasswordReset(email);

      // Always return success to prevent email enumeration
      return res.status(200).json({
        status: 'success',
        message: 'If an account with that email exists, a password reset link has been sent (placeholder)',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password (Using Placeholder Service)
   */
  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;

      const success = await authService.resetPassword(token, password);

      if (!success) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Invalid or expired token (placeholder)',
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Password has been reset successfully (placeholder)',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify email (Using Placeholder Service)
   */
  public async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body; // Assuming token is in body, adjust if in params/query

      const success = await authService.verifyEmail(token);

      if (!success) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Invalid or expired token (placeholder)',
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Email verified successfully (placeholder)',
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
      console.log('[AuthController.logout] Placeholder: User logged out. Client should clear tokens.');
      return res.status(200).json({
        status: 'success',
        message: 'Logged out successfully (placeholder)',
      });
    } catch (error) {
      next(error);
    }
  }
}
