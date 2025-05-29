import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import friendRoutes from './friend.routes';
import photoRoutes from './photo.routes';
import deviceRoutes from './device.routes';
import notificationRoutes from './notification.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/friends', friendRoutes);
router.use('/photos', photoRoutes);
router.use('/devices', deviceRoutes);
router.use('/notifications', notificationRoutes);

export default router;
