import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import {
  registerValidation,
  loginValidation,
  passwordResetRequestValidation,
  passwordResetValidation,
  emailVerificationValidation,
  validate
} from '../middlewares/validation.middleware';

const router = Router();
const authController = new AuthController();

// Register a new user
router.post('/register', registerValidation, validate, (req, res, next) => 
  authController.register(req, res, next)
);

// Login user
router.post('/login', loginValidation, validate, (req, res, next) => 
  authController.login(req, res, next)
);

// Refresh token
router.post('/refresh', (req, res, next) => 
  authController.refreshToken(req, res, next)
);

// Request password reset
router.post('/password/reset', passwordResetRequestValidation, validate, (req, res, next) => 
  authController.requestPasswordReset(req, res, next)
);

// Reset password
router.put('/password/update', passwordResetValidation, validate, (req, res, next) => 
  authController.resetPassword(req, res, next)
);

// Verify email
router.post('/verify', emailVerificationValidation, validate, (req, res, next) => 
  authController.verifyEmail(req, res, next)
);

// Logout
router.post('/logout', (req, res, next) => 
  authController.logout(req, res, next)
);

export default router;
