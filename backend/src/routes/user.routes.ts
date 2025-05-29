import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  updateUserValidation,
  changePasswordValidation,
  validate
} from '../middlewares/validation.middleware';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authMiddleware);

// Get current user profile
router.get('/me', (req, res, next) => 
  userController.getCurrentUser(req, res, next)
);

// Update current user profile
router.put('/me', updateUserValidation, validate, (req, res, next) => 
  userController.updateCurrentUser(req, res, next)
);

// Delete current user account
router.delete('/me', (req, res, next) => 
  userController.deleteCurrentUser(req, res, next)
);

// Search users
router.get('/search', (req, res, next) => 
  userController.searchUsers(req, res, next)
);

// Change password
router.put('/password', changePasswordValidation, validate, (req, res, next) => 
  userController.changePassword(req, res, next)
);

export default router;
