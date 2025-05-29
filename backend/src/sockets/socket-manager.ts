import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyJwt } from '../utils/jwt.util';
import { UserService } from '../services/user.service';
import { FriendService } from '../services/friend.service';
import { NotificationService } from '../services/notification.service';
import { DeviceService } from '../services/device.service';

export class SocketManager {
  private io: Server;
  private userService: UserService;
  private friendService: FriendService;
  private notificationService: NotificationService;
  private deviceService: DeviceService;
  private connectedUsers: Map<number, string[]> = new Map(); // userId -> socketIds[]

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.userService = new UserService();
    this.friendService = new FriendService();
    this.notificationService = new NotificationService();
    this.deviceService = new DeviceService();

    this.setupSocketAuth();
    this.setupEventHandlers();
  }

  private setupSocketAuth() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
          return next(new Error('Authentication error: Token missing'));
        }
        
        const decoded = verifyJwt(token);
        
        if (!decoded || !decoded.userId) {
          return next(new Error('Authentication error: Invalid token'));
        }
        
        // Attach user data to socket
        socket.data.userId = decoded.userId;
        
        // Update device last active time
        if (socket.handshake.auth.deviceId) {
          await this.deviceService.updateLastActive(socket.handshake.auth.deviceId);
        }
        
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      this.handleConnection(socket);
      
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
      
      // Friend events
      socket.on('friend:request', (data) => {
        this.handleFriendRequest(socket, data);
      });
      
      socket.on('friend:accept', (data) => {
        this.handleFriendAccept(socket, data);
      });
      
      socket.on('friend:reject', (data) => {
        this.handleFriendReject(socket, data);
      });
      
      // Photo events
      socket.on('photo:new', (data) => {
        this.handleNewPhoto(socket, data);
      });
      
      socket.on('photo:view', (data) => {
        this.handlePhotoView(socket, data);
      });
      
      // Status events
      socket.on('user:status', (data) => {
        this.handleUserStatus(socket, data);
      });
      
      // Typing events (for future chat feature)
      socket.on('typing:start', (data) => {
        this.handleTypingStart(socket, data);
      });
      
      socket.on('typing:stop', (data) => {
        this.handleTypingStop(socket, data);
      });
    });
  }

  private handleConnection(socket: Socket) {
    const userId = socket.data.userId;
    
    if (!userId) return;
    
    // Add to connected users map
    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, []);
    }
    
    this.connectedUsers.get(userId)?.push(socket.id);
    
    // Notify friends that user is online
    this.notifyUserStatus(userId, 'online');
    
    console.log(`User ${userId} connected with socket ${socket.id}`);
  }

  private handleDisconnect(socket: Socket) {
    const userId = socket.data.userId;
    
    if (!userId) return;
    
    // Remove from connected users map
    const userSockets = this.connectedUsers.get(userId) || [];
    const updatedSockets = userSockets.filter(id => id !== socket.id);
    
    if (updatedSockets.length === 0) {
      // User has no more active connections
      this.connectedUsers.delete(userId);
      
      // Notify friends that user is offline
      this.notifyUserStatus(userId, 'offline');
    } else {
      this.connectedUsers.set(userId, updatedSockets);
    }
    
    console.log(`User ${userId} disconnected from socket ${socket.id}`);
  }

  private async handleFriendRequest(socket: Socket, data: { friendId: number }) {
    const userId = socket.data.userId;
    
    if (!userId || !data.friendId) return;
    
    try {
      // This would be handled by the friend service in a real implementation
      // Just emitting to the target user for demonstration
      this.emitToUser(data.friendId, 'friend:request', {
        userId,
        status: 'pending'
      });
    } catch (error) {
      console.error('Error handling friend request:', error);
      socket.emit('error', { message: 'Failed to send friend request' });
    }
  }

  private async handleFriendAccept(socket: Socket, data: { friendId: number }) {
    const userId = socket.data.userId;
    
    if (!userId || !data.friendId) return;
    
    try {
      // This would be handled by the friend service in a real implementation
      // Just emitting to the target user for demonstration
      this.emitToUser(data.friendId, 'friend:accepted', {
        userId,
        status: 'accepted'
      });
    } catch (error) {
      console.error('Error handling friend accept:', error);
      socket.emit('error', { message: 'Failed to accept friend request' });
    }
  }

  private async handleFriendReject(socket: Socket, data: { friendId: number }) {
    const userId = socket.data.userId;
    
    if (!userId || !data.friendId) return;
    
    try {
      // This would be handled by the friend service in a real implementation
      // No need to notify the other user in this case
    } catch (error) {
      console.error('Error handling friend reject:', error);
      socket.emit('error', { message: 'Failed to reject friend request' });
    }
  }

  private async handleNewPhoto(socket: Socket, data: { photoId: number, recipients: number[] }) {
    const userId = socket.data.userId;
    
    if (!userId || !data.photoId || !data.recipients) return;
    
    try {
      // Notify all recipients about the new photo
      for (const recipientId of data.recipients) {
        this.emitToUser(recipientId, 'photo:new', {
          senderId: userId,
          photoId: data.photoId
        });
      }
    } catch (error) {
      console.error('Error handling new photo:', error);
      socket.emit('error', { message: 'Failed to notify about new photo' });
    }
  }

  private async handlePhotoView(socket: Socket, data: { photoId: number, senderId: number }) {
    const userId = socket.data.userId;
    
    if (!userId || !data.photoId || !data.senderId) return;
    
    try {
      // Notify the sender that their photo was viewed
      this.emitToUser(data.senderId, 'photo:viewed', {
        viewerId: userId,
        photoId: data.photoId
      });
    } catch (error) {
      console.error('Error handling photo view:', error);
      socket.emit('error', { message: 'Failed to notify about photo view' });
    }
  }

  private async handleUserStatus(socket: Socket, data: { status: 'online' | 'offline' | 'away' }) {
    const userId = socket.data.userId;
    
    if (!userId || !data.status) return;
    
    try {
      // Notify friends about user status change
      this.notifyUserStatus(userId, data.status);
    } catch (error) {
      console.error('Error handling user status:', error);
      socket.emit('error', { message: 'Failed to update status' });
    }
  }

  private async handleTypingStart(socket: Socket, data: { recipientId: number }) {
    const userId = socket.data.userId;
    
    if (!userId || !data.recipientId) return;
    
    try {
      // Notify the recipient that the user started typing
      this.emitToUser(data.recipientId, 'typing:start', {
        userId
      });
    } catch (error) {
      console.error('Error handling typing start:', error);
    }
  }

  private async handleTypingStop(socket: Socket, data: { recipientId: number }) {
    const userId = socket.data.userId;
    
    if (!userId || !data.recipientId) return;
    
    try {
      // Notify the recipient that the user stopped typing
      this.emitToUser(data.recipientId, 'typing:stop', {
        userId
      });
    } catch (error) {
      console.error('Error handling typing stop:', error);
    }
  }

  private async notifyUserStatus(userId: number, status: 'online' | 'offline' | 'away') {
    try {
      // Get user's friends
      const friends = await this.friendService.getFriends(userId);
      
      // Notify all friends about the status change
      for (const friend of friends) {
        const friendId = friend.user_id === userId ? friend.friend_id : friend.user_id;
        
        this.emitToUser(friendId, 'user:status', {
          userId,
          status
        });
      }
    } catch (error) {
      console.error('Error notifying user status:', error);
    }
  }

  private emitToUser(userId: number, event: string, data: any) {
    const socketIds = this.connectedUsers.get(userId) || [];
    
    for (const socketId of socketIds) {
      this.io.to(socketId).emit(event, data);
    }
  }

  public broadcastToAll(event: string, data: any) {
    this.io.emit(event, data);
  }

  public broadcastToRoom(room: string, event: string, data: any) {
    this.io.to(room).emit(event, data);
  }

  public getUserSocketIds(userId: number): string[] {
    return this.connectedUsers.get(userId) || [];
  }

  public isUserOnline(userId: number): boolean {
    return this.connectedUsers.has(userId) && this.connectedUsers.get(userId)!.length > 0;
  }
}

export default SocketManager;
