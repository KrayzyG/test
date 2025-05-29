import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/app.config';
import { UserService } from './user.service';
import { MailService } from './mail.service';
import { v4 as uuidv4 } from 'uuid';

const userService = new UserService();
const mailService = new MailService();

export class AuthService {
  /**
   * Register a new user
   */
  public async register(userData: {
    username: string;
    email: string;
    phone?: string;
    password: string;
  }): Promise<User> {
    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Create user
    const user = await User.create({
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      password_hash: userData.password,
      verification_token: verificationToken,
      is_verified: false,
    });
    
    // Send verification email
    await mailService.sendVerificationEmail(user.email, user.username, verificationToken);
    
    return user;
  }
  
  /**
   * Authenticate user
   */
  public async authenticate(email: string, password: string): Promise<User | null> {
    const user = await userService.findByEmail(email);
    
    if (!user) {
      return null;
    }
    
    // Check if user is active
    if (!user.is_active) {
      return null;
    }
    
    // Verify password
    const isMatch = await user.checkPassword(password);
    
    if (!isMatch) {
      return null;
    }
    
    return user;
  }
  
  /**
   * Generate JWT tokens
   */
  public async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn,
      }
    );
    
    const refreshToken = jwt.sign(
      {
        id: user.id,
        tokenId: uuidv4(),
      },
      config.jwt.refreshSecret,
      {
        expiresIn: config.jwt.refreshExpiresIn,
      }
    );
    
    return { accessToken, refreshToken };
  }
  
  /**
   * Refresh token
   */
  public async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as jwt.JwtPayload;
      
      // Get user
      const user = await userService.findById(decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Check if user is active
      if (!user.is_active) {
        throw new Error('User is not active');
      }
      
      // Generate new tokens
      const tokens = await this.generateTokens(user);
      
      return { ...tokens, user };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Request password reset
   */
  public async requestPasswordReset(email: string): Promise<boolean> {
    const user = await userService.findByEmail(email);
    
    if (!user) {
      // Return true to prevent email enumeration
      return true;
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Token expires in 1 hour
    
    // Update user
    await user.update({
      reset_token: resetToken,
      reset_token_expires: resetTokenExpires,
    });
    
    // Send reset email
    await mailService.sendPasswordResetEmail(user.email, user.username, resetToken);
    
    return true;
  }
  
  /**
   * Reset password
   */
  public async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expires: {
          [Op.gt]: new Date(), // Token not expired
        },
      },
    });
    
    if (!user) {
      return false;
    }
    
    // Update password
    await user.update({
      password_hash: await User.hashPassword(newPassword),
      reset_token: null,
      reset_token_expires: null,
    });
    
    return true;
  }
  
  /**
   * Verify email
   */
  public async verifyEmail(token: string): Promise<boolean> {
    const user = await User.findOne({
      where: {
        verification_token: token,
      },
    });
    
    if (!user) {
      return false;
    }
    
    // Update user
    await user.update({
      is_verified: true,
      verification_token: null,
    });
    
    return true;
  }
}
