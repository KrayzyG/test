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


// V1 Router
const v1Router = Router();
import { momentRouter } from './moment.routes';
v1Router.use('/moments', momentRouter);

// Mount the v1 router under /v1
// This means the effective path for moments will be /api/v1/moments
// when combined with app.use('/api', routes) in app.ts
router.use('/v1', v1Router);


export default router;
