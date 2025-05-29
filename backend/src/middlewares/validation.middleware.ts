import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation middleware
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Validation error',
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
      })),
    });
  }
  next();
};

// Auth validation rules
export const registerValidation = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_\.]+$/).withMessage('Username can only contain letters, numbers, underscores and dots'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('phone')
    .optional()
    .isMobilePhone('any').withMessage('Invalid phone number format'),
];

export const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

export const passwordResetRequestValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
];

export const passwordResetValidation = [
  body('token')
    .notEmpty().withMessage('Token is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

export const emailVerificationValidation = [
  body('token')
    .notEmpty().withMessage('Token is required'),
];

// User validation rules
export const updateUserValidation = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_\.]+$/).withMessage('Username can only contain letters, numbers, underscores and dots'),
  body('phone')
    .optional()
    .isMobilePhone('any').withMessage('Invalid phone number format'),
  body('profile_image')
    .optional()
    .isURL().withMessage('Profile image must be a valid URL'),
];

export const changePasswordValidation = [
  body('current_password')
    .notEmpty().withMessage('Current password is required'),
  body('new_password')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

// Friend validation rules
export const friendRequestValidation = [
  body('friend_id')
    .notEmpty().withMessage('Friend ID is required')
    .isInt().withMessage('Friend ID must be an integer'),
];

// Photo validation rules
export const uploadPhotoValidation = [
  body('caption')
    .optional()
    .isString().withMessage('Caption must be a string'),
  body('recipients')
    .notEmpty().withMessage('Recipients are required')
    .isArray().withMessage('Recipients must be an array'),
];

// Device validation rules
export const registerDeviceValidation = [
  body('device_token')
    .notEmpty().withMessage('Device token is required'),
  body('platform')
    .notEmpty().withMessage('Platform is required')
    .isIn(['ios', 'android']).withMessage('Platform must be either ios or android'),
];

export const updateDeviceValidation = [
  body('device_token')
    .notEmpty().withMessage('Device token is required'),
];

// Notification validation rules
export const notificationPaginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('unread_only')
    .optional()
    .isBoolean().withMessage('Unread only must be a boolean'),
];

// ID parameter validation
export const idParamValidation = [
  param('id')
    .notEmpty().withMessage('ID is required')
    .isInt().withMessage('ID must be an integer'),
];

// Moment validation rules
export const validateMomentCreation = [
  body('data.thumbnail_url') // Adjusted to match the structure sent by the frontend
    .notEmpty().withMessage('Thumbnail URL is required')
    .isURL().withMessage('Thumbnail URL must be a valid URL'),
  body('data.recipients') // Adjusted to match the structure
    .notEmpty().withMessage('Recipients are required')
    .isArray().withMessage('Recipients must be an array'),
  body('data.overlays') // Adjusted to match the structure
    .optional()
    .isArray().withMessage('Overlays must be an array'),
];
