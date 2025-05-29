import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || 'locket_user',
    password: process.env.DB_PASSWORD || 'locket_password',
    database: process.env.DB_NAME || 'locket_db',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret_key_for_development',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'default_refresh_token_secret_for_development',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '90d',
  },
  
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  },
  
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@locket-clone.com',
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
  },
  
  encryption: {
    key: process.env.ENCRYPTION_KEY || 'default32characterencryptionkeydev',
  },
  
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://locket-clone.com', /\.locket-clone\.com$/]
      : '*',
  },
};

export default config;
