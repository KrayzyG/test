import Notification from '../models/notification.model';
import { Op } from 'sequelize';

export class NotificationService {
  /**
   * Get notification by ID
   */
  public async getNotificationById(id: number): Promise<Notification | null> {
    return Notification.findByPk(id);
  }
  
  /**
   * Create a new notification
   */
  public async createNotification(notificationData: {
    user_id: number;
    type: 'photo' | 'friend_request' | 'friend_accept' | 'system';
    reference_id?: number;
    content: string;
  }): Promise<Notification> {
    return Notification.create({
      user_id: notificationData.user_id,
      type: notificationData.type,
      reference_id: notificationData.reference_id,
      content: notificationData.content,
      is_read: false,
    });
  }
  
  /**
   * Get user notifications
   */
  public async getUserNotifications(
    userId: number,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ) {
    const offset = (page - 1) * limit;
    
    const whereClause: any = {
      user_id: userId,
    };
    
    if (unreadOnly) {
      whereClause.is_read = false;
    }
    
    const notifications = await Notification.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });
    
    return notifications;
  }
  
  /**
   * Mark notification as read
   */
  public async markAsRead(id: number): Promise<Notification> {
    const notification = await this.getNotificationById(id);
    
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    await notification.update({ is_read: true });
    return notification;
  }
  
  /**
   * Mark all notifications as read
   */
  public async markAllAsRead(userId: number): Promise<number> {
    const [affectedRows] = await Notification.update(
      { is_read: true },
      {
        where: {
          user_id: userId,
          is_read: false,
        },
      }
    );
    
    return affectedRows;
  }
  
  /**
   * Delete notification
   */
  public async deleteNotification(id: number): Promise<boolean> {
    const notification = await this.getNotificationById(id);
    
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    await notification.destroy();
    return true;
  }
  
  /**
   * Get unread notification count
   */
  public async getUnreadCount(userId: number): Promise<number> {
    return Notification.count({
      where: {
        user_id: userId,
        is_read: false,
      },
    });
  }
  
  /**
   * Delete old notifications
   */
  public async deleteOldNotifications(days: number = 30): Promise<number> {
    const date = new Date();
    date.setDate(date.getDate() - days);
    
    const [affectedRows] = await Notification.update(
      { is_read: true },
      {
        where: {
          created_at: {
            [Op.lt]: date,
          },
        },
      }
    );
    
    return affectedRows;
  }
}
