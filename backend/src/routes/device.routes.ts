import { Router } from 'express';
import { DeviceController } from '../controllers/device.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  registerDeviceValidation,
  updateDeviceValidation,
  idParamValidation,
  validate
} from '../middlewares/validation.middleware';

const router = Router();
const deviceController = new DeviceController();

// All routes require authentication
router.use(authMiddleware);

// Register a new device
router.post('/', registerDeviceValidation, validate, (req, res, next) => 
  deviceController.registerDevice(req, res, next)
);

// Update device token
router.put('/:id', idParamValidation, updateDeviceValidation, validate, (req, res, next) => 
  deviceController.updateDevice(req, res, next)
);

// Delete device
router.delete('/:id', idParamValidation, validate, (req, res, next) => 
  deviceController.deleteDevice(req, res, next)
);

// Get user devices
router.get('/', (req, res, next) => 
  deviceController.getUserDevices(req, res, next)
);

export default router;
