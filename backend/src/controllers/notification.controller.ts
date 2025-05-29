import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { AuthRequest } from '../types/express';

const notificationService = new NotificationService();

export class NotificationController {
  /**
   * Get user notifications
   */
  public async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }
      
      const { page = '1', limit = '20', unread_only = 'false' } = req.query;
      
      const notifications = await notificationService.getUserNotifications(
        userId,
        parseInt(page as string),
        parseInt(limit as string),
        unread_only === 'true'
      );
      
      return res.status(200).json({
        status: 'success',
        data: {
          notifications: notifications.rows.map(notification => ({
            id: notification.id,
            type: notification.type,
            reference_id: notification.reference_id,
            content: notification.content,
            is_read: notification.is_read,
            created_at: notification.created_at,
          })),
          pagination: {
            total: notifications.count,
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            pages: Math.ceil(notifications.count / parseInt(limit as string)),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Mark notification as read
   */
  public async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }
      
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Notification ID is required',
        });
      }
      
      const notification = await notificationService.getNotificationById(parseInt(id));
      
      if (!notification) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Notification not found',
        });
      }
      
      // Check if notification belongs to the user
      if (notification.user_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to mark this notification as read',
        });
      }
      
      await notificationService.markAsRead(parseInt(id));
      
      return res.status(200).json({
        status: 'success',
        message: 'Notification marked as read',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Mark all notifications as read
   */
  public async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }
      
      await notificationService.markAllAsRead(userId);
      
      return res.status(200).json({
        status: 'success',
        message: 'All notifications marked as read',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete notification
   */
  public async deleteNotification(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }
      
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Notification ID is required',
        });
      }
      
      const notification = await notificationService.getNotificationById(parseInt(id));
      
      if (!notification) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Notification not found',
        });
      }
      
      // Check if notification belongs to the user
      if (notification.user_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to delete this notification',
        });
      }
      
      await notificationService.deleteNotification(parseInt(id));
      
      return res.status(200).json({
        status: 'success',
        message: 'Notification deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get unread notification count
   */
  public async getUnreadCount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }
      
      const count = await notificationService.getUnreadCount(userId);
      
      return res.status(200).json({
        status: 'success',
        data: {
          unread_count: count,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
