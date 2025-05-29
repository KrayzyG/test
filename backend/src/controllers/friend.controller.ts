import { Request, Response, NextFunction } from 'express';
import { FriendService } from '../services/friend.service';
import { NotificationService } from '../services/notification.service';
import { AuthRequest } from '../types/express';

const friendService = new FriendService();
const notificationService = new NotificationService();

export class FriendController {
  /**
   * Get friends list
   */
  public async getFriends(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }
      
      const friends = await friendService.getFriends(userId);
      
      return res.status(200).json({
        status: 'success',
        data: {
          friends: friends.map(friend => ({
            id: friend.id,
            user: {
              id: friend.friend.id,
              username: friend.friend.username,
              profile_image: friend.friend.profile_image,
            },
            status: friend.status,
            created_at: friend.created_at,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Send friend request
   */
  public async sendFriendRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }
      
      const { friend_id } = req.body;
      
      if (!friend_id) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Friend ID is required',
        });
      }
      
      // Check if trying to add self
      if (userId === parseInt(friend_id)) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Cannot send friend request to yourself',
        });
      }
      
      // Check if already friends or request pending
      const existingFriend = await friendService.getFriendship(userId, parseInt(friend_id));
      if (existingFriend) {
        return res.status(409).json({
          status: 'error',
          code: 409,
          message: `Friend request already ${existingFriend.status}`,
        });
      }
      
      const friendship = await friendService.sendFriendRequest(userId, parseInt(friend_id));
      
      // Create notification for recipient
      await notificationService.createNotification({
        user_id: parseInt(friend_id),
        type: 'friend_request',
        reference_id: userId,
        content: `You have a new friend request from ${req.user?.username}`,
      });
      
      return res.status(201).json({
        status: 'success',
        data: {
          friendship: {
            id: friendship.id,
            user_id: friendship.user_id,
            friend_id: friendship.friend_id,
            status: friendship.status,
            created_at: friendship.created_at,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get friend requests
   */
  public async getFriendRequests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }
      
      const requests = await friendService.getFriendRequests(userId);
      
      return res.status(200).json({
        status: 'success',
        data: {
          requests: requests.map(request => ({
            id: request.id,
            user: {
              id: request.user.id,
              username: request.user.username,
              profile_image: request.user.profile_image,
            },
            created_at: request.created_at,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Accept friend request
   */
  public async acceptFriendRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }
      
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Friend request ID is required',
        });
      }
      
      const friendship = await friendService.getFriendshipById(parseInt(id));
      
      if (!friendship) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Friend request not found',
        });
      }
      
      // Check if user is the recipient of the request
      if (friendship.friend_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to accept this friend request',
        });
      }
      
      // Check if request is pending
      if (friendship.status !== 'pending') {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: `Friend request is ${friendship.status}`,
        });
      }
      
      const updatedFriendship = await friendService.acceptFriendRequest(parseInt(id));
      
      // Create notification for sender
      await notificationService.createNotification({
        user_id: friendship.user_id,
        type: 'friend_accept',
        reference_id: userId,
        content: `${req.user?.username} accepted your friend request`,
      });
      
      return res.status(200).json({
        status: 'success',
        data: {
          friendship: {
            id: updatedFriendship.id,
            user_id: updatedFriendship.user_id,
            friend_id: updatedFriendship.friend_id,
            status: updatedFriendship.status,
            created_at: updatedFriendship.created_at,
            updated_at: updatedFriendship.updated_at,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Reject friend request
   */
  public async rejectFriendRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }
      
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Friend request ID is required',
        });
      }
      
      const friendship = await friendService.getFriendshipById(parseInt(id));
      
      if (!friendship) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Friend request not found',
        });
      }
      
      // Check if user is the recipient of the request
      if (friendship.friend_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to reject this friend request',
        });
      }
      
      // Check if request is pending
      if (friendship.status !== 'pending') {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: `Friend request is ${friendship.status}`,
        });
      }
      
      await friendService.rejectFriendRequest(parseInt(id));
      
      return res.status(200).json({
        status: 'success',
        message: 'Friend request rejected successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Remove friend
   */
  public async removeFriend(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }
      
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Friend ID is required',
        });
      }
      
      const friendship = await friendService.getFriendshipById(parseInt(id));
      
      if (!friendship) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Friendship not found',
        });
      }
      
      // Check if user is part of the friendship
      if (friendship.user_id !== userId && friendship.friend_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to remove this friendship',
        });
      }
      
      await friendService.removeFriend(parseInt(id));
      
      return res.status(200).json({
        status: 'success',
        message: 'Friend removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
