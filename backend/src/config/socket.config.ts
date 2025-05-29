import { Server } from 'socket.io';
import http from 'http';
import config from './app.config';
import { verifyToken } from '../utils/jwt';

// Socket.io configuration
const configureSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: config.cors.origin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token not provided'));
      }
      
      const decoded = await verifyToken(token);
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  return io;
};

export default configureSocket;
