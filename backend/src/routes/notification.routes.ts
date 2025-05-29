import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  notificationPaginationValidation,
  idParamValidation,
  validate
} from '../middlewares/validation.middleware';

const router = Router();
const notificationController = new NotificationController();

// All routes require authentication
router.use(authMiddleware);

// Get user notifications
router.get('/', notificationPaginationValidation, validate, (req, res, next) => 
  notificationController.getNotifications(req, res, next)
);

// Mark notification as read
router.put('/:id/read', idParamValidation, validate, (req, res, next) => 
  notificationController.markAsRead(req, res, next)
);

// Mark all notifications as read
router.put('/read-all', (req, res, next) => 
  notificationController.markAllAsRead(req, res, next)
);

// Delete notification
router.delete('/:id', idParamValidation, validate, (req, res, next) => 
  notificationController.deleteNotification(req, res, next)
);

// Get unread notification count
router.get('/unread-count', (req, res, next) => 
  notificationController.getUnreadCount(req, res, next)
);

export default router;
