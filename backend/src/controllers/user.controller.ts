import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service'; // Uses placeholder service
import { AuthRequest } from '../types/express';

const userService = new UserService(); // Instantiates the placeholder service

export class UserController {
  /**
   * Get current user profile (Using Placeholder Service)
   */
  public async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }

      const user = await userService.findById(userId); // Uses placeholder service

      if (!user) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'User not found (placeholder)',
        });
      }

      return res.status(200).json({
        status: 'success',
        data: {
          user: { // Return mock user data from placeholder service
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            profile_image: user.profile_image,
            is_verified: user.is_verified,
            created_at: user.created_at,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update current user profile (Using Placeholder Service)
   */
  public async updateCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }

      const { username, phone, profile_image } = req.body;

      // Placeholder: Simulate check if username is already taken
      if (username) {
        const existingUser = await userService.findByUsername(username); // Uses placeholder
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({
            status: 'error',
            code: 409,
            message: 'Username is already taken (placeholder)',
          });
        }
      }

      const updatedUser = await userService.update(userId, { // Uses placeholder
        username,
        phone,
        profile_image,
      });

      return res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            phone: updatedUser.phone,
            profile_image: updatedUser.profile_image,
            is_verified: updatedUser.is_verified,
            created_at: updatedUser.created_at,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete current user account (Using Placeholder Service)
   */
  public async deleteCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }

      await userService.delete(userId); // Uses placeholder

      return res.status(200).json({
        status: 'success',
        message: 'User account deleted successfully (placeholder)',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search users (Using Placeholder Service)
   */
  public async searchUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id; // Current user ID

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }

      const { query } = req.query;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Search query is required',
        });
      }

      const users = await userService.search(query, userId); // Uses placeholder

      return res.status(200).json({
        status: 'success',
        data: {
          users: users.map(user => ({ // Map mock user data
            id: user.id,
            username: user.username,
            profile_image: user.profile_image,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password (Using Placeholder Service)
   */
  public async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }

      const { current_password, new_password } = req.body;

      const success = await userService.changePassword(userId, current_password, new_password); // Uses placeholder

      if (!success) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Current password is incorrect (placeholder)',
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Password changed successfully (placeholder)',
      });
    } catch (error) {
      next(error);
    }
  }
}
