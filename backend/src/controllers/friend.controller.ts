import { Request, Response, NextFunction } from 'express';
import { FriendService } from '../services/friend.service'; // Uses placeholder service
import { NotificationService } from '../services/notification.service'; // Uses placeholder service
import { AuthRequest } from '../types/express';

const friendService = new FriendService(); // Instantiates placeholder service
const notificationService = new NotificationService(); // Instantiates placeholder service

export class FriendController {
  /**
   * Get friends list (Using Placeholder Service)
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

      const friends = await friendService.getFriends(userId); // Uses placeholder

      return res.status(200).json({
        status: 'success',
        data: {
          friends: friends.map(friendship => {
            // Determine who is the actual friend in the relationship for the current user
            const actualFriendUser = friendship.user_id === userId ? friendship.friend : friendship.user;
            return {
              id: friendship.id, // Friendship ID
              user: { // The friend's user details
                id: actualFriendUser.id,
                username: actualFriendUser.username,
                profile_image: actualFriendUser.profile_image,
              },
              status: friendship.status,
              created_at: friendship.created_at,
            };
          }),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send friend request (Using Placeholder Service)
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
      const friendIdNum = parseInt(friend_id);

      if (!friendIdNum) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Friend ID is required and must be a number',
        });
      }

      if (userId === friendIdNum) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Cannot send friend request to yourself',
        });
      }

      const existingFriendship = await friendService.getFriendship(userId, friendIdNum); // Uses placeholder
      if (existingFriendship) {
        return res.status(409).json({
          status: 'error',
          code: 409,
          message: `Friend request already ${existingFriendship.status} (placeholder)`,
        });
      }

      const friendship = await friendService.sendFriendRequest(userId, friendIdNum); // Uses placeholder

      // Placeholder: Simulate notification creation
      // await notificationService.createNotification({ ... }); // Original
      console.log(`[FriendController.sendFriendRequest] Placeholder: Simulating notification for friend request to user ID ${friendIdNum}`);


      return res.status(201).json({
        status: 'success',
        data: {
          friendship: { // Return mock friendship data
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
   * Get friend requests (Using Placeholder Service)
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

      const requests = await friendService.getFriendRequests(userId); // Uses placeholder

      return res.status(200).json({
        status: 'success',
        data: {
          requests: requests.map(request => ({ // Map mock request data
            id: request.id,
            user: { // The user who sent the request
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
   * Accept friend request (Using Placeholder Service)
   */
  public async acceptFriendRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id; // The user accepting the request

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }

      const { id } = req.params; // Friendship ID
      const friendshipIdNum = parseInt(id);

      if (!friendshipIdNum) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Friend request ID is required and must be a number',
        });
      }

      const friendship = await friendService.getFriendshipById(friendshipIdNum); // Uses placeholder

      if (!friendship) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Friend request not found (placeholder)',
        });
      }

      if (friendship.friend_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to accept this friend request (placeholder)',
        });
      }

      if (friendship.status !== 'pending') {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: `Friend request is already ${friendship.status} (placeholder)`,
        });
      }

      const updatedFriendship = await friendService.acceptFriendRequest(friendshipIdNum); // Uses placeholder

      // Placeholder: Simulate notification creation
      // await notificationService.createNotification({ ... }); // Original
      console.log(`[FriendController.acceptFriendRequest] Placeholder: Simulating notification for accepted request to user ID ${friendship.user_id}`);


      return res.status(200).json({
        status: 'success',
        data: {
          friendship: { // Return mock updated friendship data
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
   * Reject friend request (Using Placeholder Service)
   */
  public async rejectFriendRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id; // The user rejecting the request

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }

      const { id } = req.params; // Friendship ID
      const friendshipIdNum = parseInt(id);

      if (!friendshipIdNum) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Friend request ID is required and must be a number',
        });
      }

      const friendship = await friendService.getFriendshipById(friendshipIdNum); // Uses placeholder

      if (!friendship) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Friend request not found (placeholder)',
        });
      }

      if (friendship.friend_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to reject this friend request (placeholder)',
        });
      }

      if (friendship.status !== 'pending') {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: `Friend request is already ${friendship.status} (placeholder)`,
        });
      }

      await friendService.rejectFriendRequest(friendshipIdNum); // Uses placeholder

      return res.status(200).json({
        status: 'success',
        message: 'Friend request rejected successfully (placeholder)',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove friend (Using Placeholder Service)
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

      const { id } = req.params; // Friendship ID
      const friendshipIdNum = parseInt(id);

      if (!friendshipIdNum) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Friend ID (friendship ID) is required and must be a number',
        });
      }

      const friendship = await friendService.getFriendshipById(friendshipIdNum); // Uses placeholder

      if (!friendship) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Friendship not found (placeholder)',
        });
      }

      if (friendship.user_id !== userId && friendship.friend_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to remove this friendship (placeholder)',
        });
      }
      
      if (friendship.status !== 'accepted') {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Cannot remove a friendship that is not accepted (placeholder)',
        });
      }

      await friendService.removeFriend(friendshipIdNum); // Uses placeholder

      return res.status(200).json({
        status: 'success',
        message: 'Friend removed successfully (placeholder)',
      });
    } catch (error) {
      next(error);
    }
  }
}
