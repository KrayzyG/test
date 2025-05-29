import { Request } from 'express';

// Extend Express Request interface to include user property
export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    is_verified: boolean;
  };
}
