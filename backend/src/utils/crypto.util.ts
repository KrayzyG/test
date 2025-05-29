import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a random token
 * @param length Token length
 * @returns Random token
 */
export const generateRandomToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a verification token
 * @returns Verification token
 */
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate a reset password token
 * @returns Reset password token
 */
export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate a UUID
 * @returns UUID
 */
export const generateUuid = (): string => {
  return uuidv4();
};

/**
 * Hash a string using SHA-256
 * @param data String to hash
 * @returns Hashed string
 */
export const hashString = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Encrypt data
 * @param data Data to encrypt
 * @param key Encryption key
 * @returns Encrypted data
 */
export const encryptData = (data: string, key: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${iv.toString('hex')}:${encrypted}`;
};

/**
 * Decrypt data
 * @param encryptedData Encrypted data
 * @param key Encryption key
 * @returns Decrypted data
 */
export const decryptData = (encryptedData: string, key: string): string => {
  const [ivHex, encrypted] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

/**
 * Generate a secure filename
 * @param originalFilename Original filename
 * @returns Secure filename
 */
export const generateSecureFilename = (originalFilename: string): string => {
  const extension = originalFilename.split('.').pop();
  return `${generateUuid()}.${extension}`;
};
