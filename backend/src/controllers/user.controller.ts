import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { AuthRequest } from '../types/express';

const userService = new UserService();

export class UserController {
  /**
   * Get current user profile
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
      
      const user = await userService.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'User not found',
        });
      }
      
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
            created_at: user.created_at,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update current user profile
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
      
      // Check if username is already taken
      if (username) {
        const existingUser = await userService.findByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({
            status: 'error',
            code: 409,
            message: 'Username is already taken',
          });
        }
      }
      
      const updatedUser = await userService.update(userId, {
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
   * Delete current user account
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
      
      await userService.delete(userId);
      
      return res.status(200).json({
        status: 'success',
        message: 'User account deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Search users
   */
  public async searchUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
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
      
      const users = await userService.search(query, userId);
      
      return res.status(200).json({
        status: 'success',
        data: {
          users: users.map(user => ({
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
   * Change password
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
      
      const success = await userService.changePassword(userId, current_password, new_password);
      
      if (!success) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Current password is incorrect',
        });
      }
      
      return res.status(200).json({
        status: 'success',
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
