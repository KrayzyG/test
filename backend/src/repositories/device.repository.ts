import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { Device } from '../models/device.model';

export class DeviceRepository {
  private repository: Repository<Device>;

  constructor() {
    this.repository = AppDataSource.getRepository(Device);
  }

  async findById(id: number): Promise<Device | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user']
    });
  }

  async findByDeviceToken(deviceToken: string): Promise<Device | null> {
    return this.repository.findOne({
      where: { device_token: deviceToken },
      relations: ['user']
    });
  }

  async findByUserId(userId: number): Promise<Device[]> {
    return this.repository.find({
      where: { user_id: userId },
      order: { last_active_at: 'DESC' }
    });
  }

  async create(deviceData: Partial<Device>): Promise<Device> {
    const device = this.repository.create({
      ...deviceData,
      last_active_at: new Date()
    });
    return this.repository.save(device);
  }

  async update(id: number, deviceData: Partial<Device>): Promise<Device | null> {
    await this.repository.update(id, {
      ...deviceData,
      last_active_at: new Date()
    });
    return this.findById(id);
  }

  async updateLastActive(id: number): Promise<Device | null> {
    await this.repository.update(id, { last_active_at: new Date() });
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async deleteByUserId(userId: number): Promise<boolean> {
    const result = await this.repository.delete({ user_id: userId });
    return result.affected ? result.affected > 0 : false;
  }

  async findActiveDevicesByUserId(userId: number, daysActive: number = 30): Promise<Device[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysActive);
    
    return this.repository.find({
      where: { 
        user_id: userId,
        last_active_at: cutoffDate
      },
      order: { last_active_at: 'DESC' }
    });
  }
}
