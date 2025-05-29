import { Request, Response, NextFunction } from 'express';
import { DeviceService } from '../services/device.service'; // Uses placeholder service
import { AuthRequest } from '../types/express';

const deviceService = new DeviceService(); // Instantiates placeholder service

export class DeviceController {
  /**
   * Register a new device (Using Placeholder Service)
   */
  public async registerDevice(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }

      const { device_token, platform } = req.body;

      if (!device_token) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Device token is required',
        });
      }

      if (!platform || !['ios', 'android'].includes(platform)) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Valid platform (ios or android) is required',
        });
      }

      // Placeholder: Simulate checking if device already exists and handling it
      const existingDevice = await deviceService.findByToken(device_token); // Uses placeholder

      if (existingDevice) {
        let updatedDevice;
        if (existingDevice.user_id !== userId) {
          // Simulate re-assigning device to new user
          updatedDevice = await deviceService.updateDevice(existingDevice.id, { // Uses placeholder
            user_id: userId,
            last_active_at: new Date(),
          });
        } else {
          // Simulate updating last_active_at for existing device of same user
          updatedDevice = await deviceService.updateLastActive(existingDevice.id); // Uses placeholder
        }
        return res.status(200).json({
          status: 'success',
          data: {
            device: { // Return mock device data
              id: updatedDevice.id,
              device_token: updatedDevice.device_token,
              platform: updatedDevice.platform,
              created_at: updatedDevice.created_at,
              last_active_at: updatedDevice.last_active_at,
            },
          },
        });
      }

      // Create new device using placeholder service
      const device = await deviceService.createDevice({
        user_id: userId,
        device_token,
        platform,
      });

      return res.status(201).json({
        status: 'success',
        data: {
          device: { // Return mock device data
            id: device.id,
            device_token: device.device_token,
            platform: device.platform,
            created_at: device.created_at,
            last_active_at: device.last_active_at,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update device token (Using Placeholder Service)
   */
  public async updateDevice(req: AuthRequest, res: Response, next: NextFunction) {
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
      const deviceIdNum = parseInt(id);
      const { device_token } = req.body;

      if (!deviceIdNum) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Device ID is required and must be a number',
        });
      }

      if (!device_token) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Device token is required',
        });
      }

      const device = await deviceService.findById(deviceIdNum); // Uses placeholder

      if (!device) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Device not found (placeholder)',
        });
      }

      if (device.user_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to update this device (placeholder)',
        });
      }

      const updatedDevice = await deviceService.updateDevice(deviceIdNum, { // Uses placeholder
        device_token,
        last_active_at: new Date(),
      });

      return res.status(200).json({
        status: 'success',
        data: {
          device: { // Return mock device data
            id: updatedDevice.id,
            device_token: updatedDevice.device_token,
            platform: updatedDevice.platform,
            created_at: updatedDevice.created_at,
            last_active_at: updatedDevice.last_active_at,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete device (Using Placeholder Service)
   */
  public async deleteDevice(req: AuthRequest, res: Response, next: NextFunction) {
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
      const deviceIdNum = parseInt(id);

      if (!deviceIdNum) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Device ID is required and must be a number',
        });
      }

      const device = await deviceService.findById(deviceIdNum); // Uses placeholder

      if (!device) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Device not found (placeholder)',
        });
      }

      if (device.user_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to delete this device (placeholder)',
        });
      }

      await deviceService.deleteDevice(deviceIdNum); // Uses placeholder

      return res.status(200).json({
        status: 'success',
        message: 'Device deleted successfully (placeholder)',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user devices (Using Placeholder Service)
   */
  public async getUserDevices(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }

      const devices = await deviceService.getUserDevices(userId); // Uses placeholder

      return res.status(200).json({
        status: 'success',
        data: {
          devices: devices.map(device => ({ // Map mock device data
            id: device.id,
            device_token: device.device_token,
            platform: device.platform,
            created_at: device.created_at,
            last_active_at: device.last_active_at,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
