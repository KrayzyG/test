import Device from '../models/device.model';
import { Op } from 'sequelize';

export class DeviceService {
  /**
   * Find device by ID
   */
  public async findById(id: number): Promise<Device | null> {
    return Device.findByPk(id);
  }
  
  /**
   * Find device by token
   */
  public async findByToken(deviceToken: string): Promise<Device | null> {
    return Device.findOne({
      where: { device_token: deviceToken },
    });
  }
  
  /**
   * Create a new device
   */
  public async createDevice(deviceData: {
    user_id: number;
    device_token: string;
    platform: 'ios' | 'android';
  }): Promise<Device> {
    return Device.create({
      user_id: deviceData.user_id,
      device_token: deviceData.device_token,
      platform: deviceData.platform,
      last_active_at: new Date(),
    });
  }
  
  /**
   * Update device
   */
  public async updateDevice(id: number, data: Partial<Device>): Promise<Device> {
    const device = await this.findById(id);
    
    if (!device) {
      throw new Error('Device not found');
    }
    
    await device.update(data);
    return device;
  }
  
  /**
   * Delete device
   */
  public async deleteDevice(id: number): Promise<boolean> {
    const device = await this.findById(id);
    
    if (!device) {
      throw new Error('Device not found');
    }
    
    await device.destroy();
    return true;
  }
  
  /**
   * Get user devices
   */
  public async getUserDevices(userId: number): Promise<Device[]> {
    return Device.findAll({
      where: { user_id: userId },
      order: [['last_active_at', 'DESC']],
    });
  }
  
  /**
   * Get active devices for user
   */
  public async getActiveDevices(userId: number): Promise<Device[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return Device.findAll({
      where: {
        user_id: userId,
        last_active_at: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
    });
  }
  
  /**
   * Update last active time
   */
  public async updateLastActive(id: number): Promise<Device> {
    const device = await this.findById(id);
    
    if (!device) {
      throw new Error('Device not found');
    }
    
    await device.update({ last_active_at: new Date() });
    return device;
  }
}
