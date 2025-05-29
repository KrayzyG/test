import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { Notification } from '../models/notification.model';

export class NotificationRepository {
  private repository: Repository<Notification>;

  constructor() {
    this.repository = AppDataSource.getRepository(Notification);
  }

  async findById(id: number): Promise<Notification | null> {
    return this.repository.findOne({
      where: { id }
    });
  }

  async findByUserId(userId: number, page: number = 1, limit: number = 20, unreadOnly: boolean = false): Promise<[Notification[], number]> {
    const whereCondition: any = { user_id: userId };
    
    if (unreadOnly) {
      whereCondition.is_read = false;
    }
    
    return this.repository.findAndCount({
      where: whereCondition,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit
    });
  }

  async create(notificationData: Partial<Notification>): Promise<Notification> {
    const notification = this.repository.create(notificationData);
    return this.repository.save(notification);
  }

  async markAsRead(id: number): Promise<Notification | null> {
    await this.repository.update(id, { is_read: true });
    return this.findById(id);
  }

  async markAllAsRead(userId: number): Promise<boolean> {
    const result = await this.repository.update(
      { user_id: userId, is_read: false },
      { is_read: true }
    );
    return result.affected ? result.affected > 0 : false;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async deleteByUserId(userId: number): Promise<boolean> {
    const result = await this.repository.delete({ user_id: userId });
    return result.affected ? result.affected > 0 : false;
  }

  async getUnreadCount(userId: number): Promise<number> {
    const result = await this.repository.count({
      where: { user_id: userId, is_read: false }
    });
    return result;
  }

  async deleteOldNotifications(userId: number, daysToKeep: number = 30): Promise<boolean> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const result = await this.repository.delete({
      user_id: userId,
      created_at: cutoffDate
    });
    
    return result.affected ? result.affected > 0 : false;
  }
}
