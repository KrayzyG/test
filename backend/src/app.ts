import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import http from 'http';
import config from './config/app.config';
import routes from './routes';
import { errorMiddleware } from './middlewares/error.middleware';
import configureSocket from './config/socket.config';
import './config/firebase.config';

// Create Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.io
const io = configureSocket(server);

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// CORS
app.use(cors({
  origin: config.cors.origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', environment: config.env });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Resource not found',
  });
});

// Error handler
app.use(errorMiddleware);

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Set up event handlers
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  // Photo events
  socket.on('photo:viewed', (data) => {
    // Emit to sender that their photo was viewed
    if (data.senderId && data.photoId) {
      socket.to(`user_${data.senderId}`).emit('photo:viewed', {
        photoId: data.photoId,
        viewerId: socket.data.user.id,
        viewerName: socket.data.user.username,
      });
    }
  });
  
  // Join user's room for private messages
  if (socket.data.user) {
    socket.join(`user_${socket.data.user.id}`);
  }
});

export { app, server, io };
