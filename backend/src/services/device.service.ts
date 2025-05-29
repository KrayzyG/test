import Device from '../models/device.model'; // Keep for type hinting
import { Op } from 'sequelize'; // Keep for type, though not used in placeholder

// Mock data store for devices
const mockDevices: Device[] = [
  {
    id: 1,
    user_id: 1,
    device_token: 'mock_device_token_ios_123',
    platform: 'ios',
    last_active_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  } as Device,
  {
    id: 2,
    user_id: 1,
    device_token: 'mock_device_token_android_456',
    platform: 'android',
    last_active_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    created_at: new Date(),
    updated_at: new Date(),
  } as Device,
  {
    id: 3,
    user_id: 2,
    device_token: 'mock_device_token_ios_789',
    platform: 'ios',
    last_active_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago (inactive)
    created_at: new Date(),
    updated_at: new Date(),
  } as Device,
];
let nextDeviceId = 4;

export class DeviceService {
  /**
   * Find device by ID (Placeholder)
   */
  public async findById(id: number): Promise<Device | null> {
    console.log(`[DeviceService.findById] Placeholder: Finding device by ID ${id}`);
    // Original: return Device.findByPk(id);
    const device = mockDevices.find(d => d.id === id);
    return Promise.resolve(device || null);
  }

  /**
   * Find device by token (Placeholder)
   */
  public async findByToken(deviceToken: string): Promise<Device | null> {
    console.log(`[DeviceService.findByToken] Placeholder: Finding device by token ${deviceToken}`);
    // Original: return Device.findOne({ where: { device_token: deviceToken } });
    const device = mockDevices.find(d => d.device_token === deviceToken);
    return Promise.resolve(device || null);
  }

  /**
   * Create a new device (Placeholder)
   */
  public async createDevice(deviceData: {
    user_id: number;
    device_token: string;
    platform: 'ios' | 'android';
  }): Promise<Device> {
    console.log(`[DeviceService.createDevice] Placeholder: Creating device for user ID ${deviceData.user_id}`);
    // Original: return Device.create({ ... });
    const newDevice: Device = {
      id: nextDeviceId++,
      user_id: deviceData.user_id,
      device_token: deviceData.device_token,
      platform: deviceData.platform,
      last_active_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    } as Device;
    mockDevices.push(newDevice);
    return Promise.resolve(newDevice);
  }

  /**
   * Update device (Placeholder)
   */
  public async updateDevice(id: number, data: Partial<Device>): Promise<Device> {
    console.log(`[DeviceService.updateDevice] Placeholder: Updating device ID ${id}`);
    // const device = await this.findById(id); // Original
    // if (!device) throw new Error('Device not found'); // Original
    // await device.update(data); // Original
    // return device; // Original
    const deviceIndex = mockDevices.findIndex(d => d.id === id);
    if (deviceIndex === -1) {
      throw new Error('Device not found (placeholder)');
    }
    mockDevices[deviceIndex] = { ...mockDevices[deviceIndex], ...data, updated_at: new Date() } as Device;
    return Promise.resolve(mockDevices[deviceIndex]);
  }

  /**
   * Delete device (Placeholder)
   */
  public async deleteDevice(id: number): Promise<boolean> {
    console.log(`[DeviceService.deleteDevice] Placeholder: Deleting device ID ${id}`);
    // const device = await this.findById(id); // Original
    // if (!device) throw new Error('Device not found'); // Original
    // await device.destroy(); // Original
    // return true; // Original
    const index = mockDevices.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Device not found (placeholder)');
    }
    mockDevices.splice(index, 1);
    return Promise.resolve(true);
  }

  /**
   * Get user devices (Placeholder)
   */
  public async getUserDevices(userId: number): Promise<Device[]> {
    console.log(`[DeviceService.getUserDevices] Placeholder: Getting devices for user ID ${userId}`);
    // Original: return Device.findAll({ where: { user_id: userId }, order: [['last_active_at', 'DESC']] });
    const devices = mockDevices.filter(d => d.user_id === userId)
                                .sort((a, b) => b.last_active_at.getTime() - a.last_active_at.getTime());
    return Promise.resolve(devices);
  }

  /**
   * Get active devices for user (Placeholder)
   */
  public async getActiveDevices(userId: number): Promise<Device[]> {
    console.log(`[DeviceService.getActiveDevices] Placeholder: Getting active devices for user ID ${userId}`);
    // const thirtyDaysAgo = new Date(); // Original
    // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // Original
    // return Device.findAll({ where: { user_id: userId, last_active_at: { [Op.gte]: thirtyDaysAgo } } }); // Original
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeDevices = mockDevices.filter(d => d.user_id === userId && d.last_active_at >= thirtyDaysAgo);
    return Promise.resolve(activeDevices);
  }

  /**
   * Update last active time (Placeholder)
   */
  public async updateLastActive(id: number): Promise<Device> {
    console.log(`[DeviceService.updateLastActive] Placeholder: Updating last active time for device ID ${id}`);
    // const device = await this.findById(id); // Original
    // if (!device) throw new Error('Device not found'); // Original
    // await device.update({ last_active_at: new Date() }); // Original
    // return device; // Original
    const deviceIndex = mockDevices.findIndex(d => d.id === id);
    if (deviceIndex === -1) {
      throw new Error('Device not found (placeholder)');
    }
    mockDevices[deviceIndex].last_active_at = new Date();
    mockDevices[deviceIndex].updated_at = new Date();
    return Promise.resolve(mockDevices[deviceIndex]);
  }
}
