import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service'; // Uses placeholder service
import { AuthRequest } from '../types/express';

const notificationService = new NotificationService(); // Instantiates placeholder service

export class NotificationController {
  /**
   * Get user notifications (Using Placeholder Service)
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
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      const notificationsData = await notificationService.getUserNotifications( // Uses placeholder
        userId,
        pageNum,
        limitNum,
        unread_only === 'true',
      );

      return res.status(200).json({
        status: 'success',
        data: {
          notifications: notificationsData.rows.map(notification => ({ // Map mock data
            id: notification.id,
            type: notification.type,
            reference_id: notification.reference_id,
            content: notification.content,
            is_read: notification.is_read,
            created_at: notification.created_at,
          })),
          pagination: {
            total: notificationsData.count,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(notificationsData.count / limitNum),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark notification as read (Using Placeholder Service)
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
      const notificationIdNum = parseInt(id);

      if (!notificationIdNum) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Notification ID is required and must be a number',
        });
      }

      const notification = await notificationService.getNotificationById(notificationIdNum); // Uses placeholder

      if (!notification) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Notification not found (placeholder)',
        });
      }

      if (notification.user_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to mark this notification as read (placeholder)',
        });
      }

      await notificationService.markAsRead(notificationIdNum); // Uses placeholder

      return res.status(200).json({
        status: 'success',
        message: 'Notification marked as read (placeholder)',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark all notifications as read (Using Placeholder Service)
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

      await notificationService.markAllAsRead(userId); // Uses placeholder

      return res.status(200).json({
        status: 'success',
        message: 'All notifications marked as read (placeholder)',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete notification (Using Placeholder Service)
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
      const notificationIdNum = parseInt(id);

      if (!notificationIdNum) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Notification ID is required and must be a number',
        });
      }

      const notification = await notificationService.getNotificationById(notificationIdNum); // Uses placeholder

      if (!notification) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Notification not found (placeholder)',
        });
      }

      if (notification.user_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to delete this notification (placeholder)',
        });
      }

      await notificationService.deleteNotification(notificationIdNum); // Uses placeholder

      return res.status(200).json({
        status: 'success',
        message: 'Notification deleted successfully (placeholder)',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get unread notification count (Using Placeholder Service)
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

      const count = await notificationService.getUnreadCount(userId); // Uses placeholder

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
