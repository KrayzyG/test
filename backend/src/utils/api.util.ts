import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Validate request data using express-validator
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @returns Validation error response or calls next()
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  next();
};

/**
 * Format API response
 * @param data Response data
 * @param message Response message
 * @returns Formatted response object
 */
export const formatResponse = (data: any, message: string = 'Success') => {
  return {
    status: 'success',
    message,
    data
  };
};

/**
 * Format error response
 * @param message Error message
 * @param statusCode HTTP status code
 * @param errors Additional error details
 * @returns Formatted error response
 */
export const formatErrorResponse = (message: string, statusCode: number = 500, errors: any = null) => {
  const response: any = {
    status: 'error',
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return {
    statusCode,
    body: response
  };
};

/**
 * Parse pagination parameters from request query
 * @param req Express request object
 * @returns Pagination parameters
 */
export const getPaginationParams = (req: Request) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  
  return {
    page: page > 0 ? page : 1,
    limit: limit > 0 && limit <= 100 ? limit : 20
  };
};

/**
 * Format pagination response
 * @param data Data array
 * @param total Total number of items
 * @param page Current page
 * @param limit Items per page
 * @returns Formatted pagination response
 */
export const formatPaginationResponse = (data: any[], total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages: totalPages
    }
  };
};
