import { Request, Response, NextFunction } from 'express';
import { DeviceService } from '../services/device.service';
import { AuthRequest } from '../types/express';

const deviceService = new DeviceService();

export class DeviceController {
  /**
   * Register a new device
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
      
      // Check if device already exists
      const existingDevice = await deviceService.findByToken(device_token);
      
      if (existingDevice) {
        // If device exists but belongs to another user, update it
        if (existingDevice.user_id !== userId) {
          const updatedDevice = await deviceService.updateDevice(existingDevice.id, {
            user_id: userId,
            last_active_at: new Date(),
          });
          
          return res.status(200).json({
            status: 'success',
            data: {
              device: {
                id: updatedDevice.id,
                device_token: updatedDevice.device_token,
                platform: updatedDevice.platform,
                created_at: updatedDevice.created_at,
                last_active_at: updatedDevice.last_active_at,
              },
            },
          });
        }
        
        // If device exists and belongs to the same user, update last_active_at
        const updatedDevice = await deviceService.updateDevice(existingDevice.id, {
          last_active_at: new Date(),
        });
        
        return res.status(200).json({
          status: 'success',
          data: {
            device: {
              id: updatedDevice.id,
              device_token: updatedDevice.device_token,
              platform: updatedDevice.platform,
              created_at: updatedDevice.created_at,
              last_active_at: updatedDevice.last_active_at,
            },
          },
        });
      }
      
      // Create new device
      const device = await deviceService.createDevice({
        user_id: userId,
        device_token,
        platform,
      });
      
      return res.status(201).json({
        status: 'success',
        data: {
          device: {
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
   * Update device token
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
      const { device_token } = req.body;
      
      if (!id) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Device ID is required',
        });
      }
      
      if (!device_token) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Device token is required',
        });
      }
      
      const device = await deviceService.findById(parseInt(id));
      
      if (!device) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Device not found',
        });
      }
      
      // Check if device belongs to the user
      if (device.user_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to update this device',
        });
      }
      
      const updatedDevice = await deviceService.updateDevice(parseInt(id), {
        device_token,
        last_active_at: new Date(),
      });
      
      return res.status(200).json({
        status: 'success',
        data: {
          device: {
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
   * Delete device
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
      
      if (!id) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Device ID is required',
        });
      }
      
      const device = await deviceService.findById(parseInt(id));
      
      if (!device) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Device not found',
        });
      }
      
      // Check if device belongs to the user
      if (device.user_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to delete this device',
        });
      }
      
      await deviceService.deleteDevice(parseInt(id));
      
      return res.status(200).json({
        status: 'success',
        message: 'Device deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get user devices
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
      
      const devices = await deviceService.getUserDevices(userId);
      
      return res.status(200).json({
        status: 'success',
        data: {
          devices: devices.map(device => ({
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
