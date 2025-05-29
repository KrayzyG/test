import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { UserSetting } from '../models/user-setting.model';

export class UserSettingRepository {
  private repository: Repository<UserSetting>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserSetting);
  }

  async findById(id: number): Promise<UserSetting | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user']
    });
  }

  async findByUserId(userId: number): Promise<UserSetting | null> {
    return this.repository.findOne({
      where: { user_id: userId }
    });
  }

  async create(settingData: Partial<UserSetting>): Promise<UserSetting> {
    const setting = this.repository.create(settingData);
    return this.repository.save(setting);
  }

  async update(id: number, settingData: Partial<UserSetting>): Promise<UserSetting | null> {
    await this.repository.update(id, settingData);
    return this.findById(id);
  }

  async updateByUserId(userId: number, settingData: Partial<UserSetting>): Promise<UserSetting | null> {
    const setting = await this.findByUserId(userId);
    
    if (!setting) {
      // Create new settings if they don't exist
      return this.create({ user_id: userId, ...settingData });
    }
    
    await this.repository.update(setting.id, settingData);
    return this.findById(setting.id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async deleteByUserId(userId: number): Promise<boolean> {
    const result = await this.repository.delete({ user_id: userId });
    return result.affected ? result.affected > 0 : false;
  }

  async getNotificationSettings(userId: number): Promise<{
    push_enabled: boolean;
    email_enabled: boolean;
    friend_request_notifications: boolean;
    photo_notifications: boolean;
  } | null> {
    const settings = await this.findByUserId(userId);
    
    if (!settings) {
      return null;
    }
    
    return {
      push_enabled: settings.push_enabled,
      email_enabled: settings.email_enabled,
      friend_request_notifications: settings.friend_request_notifications,
      photo_notifications: settings.photo_notifications
    };
  }

  async getPrivacySettings(userId: number): Promise<{
    widget_enabled: boolean;
    profile_visibility: string;
  } | null> {
    const settings = await this.findByUserId(userId);
    
    if (!settings) {
      return null;
    }
    
    return {
      widget_enabled: settings.widget_enabled,
      profile_visibility: settings.profile_visibility
    };
  }
}
