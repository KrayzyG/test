import Notification from '../models/notification.model'; // Keep for type hinting
import { Op } from 'sequelize'; // Keep for type, though not used in placeholder

// Mock data store for notifications
const mockNotifications: Notification[] = [
  {
    id: 1,
    user_id: 1,
    type: 'friend_request',
    reference_id: 2,
    content: 'User anotheruser sent you a friend request.',
    is_read: false,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
  } as Notification,
  {
    id: 2,
    user_id: 1,
    type: 'photo',
    reference_id: 101,
    content: 'User anotheruser sent you a new photo.',
    is_read: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  } as Notification,
  {
    id: 3,
    user_id: 2,
    type: 'system',
    content: 'Welcome to Locket Clone!',
    is_read: false,
    created_at: new Date(),
    updated_at: new Date(),
  } as Notification,
];
let nextNotificationId = 4;

export class NotificationService {
  /**
   * Get notification by ID (Placeholder)
   */
  public async getNotificationById(id: number): Promise<Notification | null> {
    console.log(`[NotificationService.getNotificationById] Placeholder: Finding notification by ID ${id}`);
    // Original: return Notification.findByPk(id);
    const notification = mockNotifications.find(n => n.id === id);
    return Promise.resolve(notification || null);
  }

  /**
   * Create a new notification (Placeholder)
   */
  public async createNotification(notificationData: {
    user_id: number;
    type: 'photo' | 'friend_request' | 'friend_accept' | 'system';
    reference_id?: number;
    content: string;
  }): Promise<Notification> {
    console.log(`[NotificationService.createNotification] Placeholder: Creating notification for user ID ${notificationData.user_id}`);
    // Original: return Notification.create({ ... });
    const newNotification: Notification = {
      id: nextNotificationId++,
      user_id: notificationData.user_id,
      type: notificationData.type,
      reference_id: notificationData.reference_id || null,
      content: notificationData.content,
      is_read: false,
      created_at: new Date(),
      updated_at: new Date(),
    } as Notification;
    mockNotifications.push(newNotification);
    // In a real app, this might also trigger a push notification. For placeholder, this is omitted.
    console.log(`[NotificationService.createNotification] Placeholder: Mock push notification would be sent for: ${newNotification.content}`);
    return Promise.resolve(newNotification);
  }

  /**
   * Get user notifications (Placeholder)
   */
  public async getUserNotifications(
    userId: number,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ): Promise<{ rows: Notification[]; count: number }> {
    console.log(`[NotificationService.getUserNotifications] Placeholder: Getting notifications for user ID ${userId}, page ${page}, limit ${limit}, unreadOnly ${unreadOnly}`);
    // Original: const notifications = await Notification.findAndCountAll({ ... }); return notifications;

    let userNotifications = mockNotifications.filter(n => n.user_id === userId);
    if (unreadOnly) {
      userNotifications = userNotifications.filter(n => !n.is_read);
    }
    userNotifications.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

    const count = userNotifications.length;
    const offset = (page - 1) * limit;
    const rows = userNotifications.slice(offset, offset + limit);

    return Promise.resolve({ rows, count });
  }

  /**
   * Mark notification as read (Placeholder)
   */
  public async markAsRead(id: number): Promise<Notification> {
    console.log(`[NotificationService.markAsRead] Placeholder: Marking notification ID ${id} as read`);
    // const notification = await this.getNotificationById(id); // Original
    // if (!notification) throw new Error('Notification not found'); // Original
    // await notification.update({ is_read: true }); // Original
    // return notification; // Original
    const notification = mockNotifications.find(n => n.id === id);
    if (!notification) {
      throw new Error('Notification not found (placeholder)');
    }
    notification.is_read = true;
    notification.updated_at = new Date();
    return Promise.resolve(notification);
  }

  /**
   * Mark all notifications as read (Placeholder)
   */
  public async markAllAsRead(userId: number): Promise<number> {
    console.log(`[NotificationService.markAllAsRead] Placeholder: Marking all notifications as read for user ID ${userId}`);
    // const [affectedRows] = await Notification.update({ is_read: true }, { where: { user_id: userId, is_read: false } }); // Original
    // return affectedRows; // Original
    let affectedCount = 0;
    mockNotifications.forEach(n => {
      if (n.user_id === userId && !n.is_read) {
        n.is_read = true;
        n.updated_at = new Date();
        affectedCount++;
      }
    });
    return Promise.resolve(affectedCount);
  }

  /**
   * Delete notification (Placeholder)
   */
  public async deleteNotification(id: number): Promise<boolean> {
    console.log(`[NotificationService.deleteNotification] Placeholder: Deleting notification ID ${id}`);
    // const notification = await this.getNotificationById(id); // Original
    // if (!notification) throw new Error('Notification not found'); // Original
    // await notification.destroy(); // Original
    // return true; // Original
    const index = mockNotifications.findIndex(n => n.id === id);
    if (index === -1) {
      throw new Error('Notification not found (placeholder)');
    }
    mockNotifications.splice(index, 1);
    return Promise.resolve(true);
  }

  /**
   * Get unread notification count (Placeholder)
   */
  public async getUnreadCount(userId: number): Promise<number> {
    console.log(`[NotificationService.getUnreadCount] Placeholder: Getting unread count for user ID ${userId}`);
    // Original: return Notification.count({ where: { user_id: userId, is_read: false } });
    const count = mockNotifications.filter(n => n.user_id === userId && !n.is_read).length;
    return Promise.resolve(count);
  }

  /**
   * Delete old notifications (Placeholder - in a real scenario, this is a batch operation)
   * For placeholder, we'll just log and return a mock count. It won't modify mockNotifications.
   */
  public async deleteOldNotifications(days: number = 30): Promise<number> {
    console.log(`[NotificationService.deleteOldNotifications] Placeholder: Simulating deletion of notifications older than ${days} days.`);
    // const date = new Date(); // Original
    // date.setDate(date.getDate() - days); // Original
    // const [affectedRows] = await Notification.update({ is_read: true /* or destroy */ }, { where: { created_at: { [Op.lt]: date } } }); // Original
    // return affectedRows; // Original
    
    // Placeholder just returns a mock number of "deleted" notifications
    return Promise.resolve(5); // Example: 5 old notifications "deleted"
  }
}
