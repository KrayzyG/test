import Friend from '../models/friend.model';
import User from '../models/user.model';
import { Op } from 'sequelize';

export class FriendService {
  /**
   * Get friends list
   */
  public async getFriends(userId: number) {
    return Friend.findAll({
      where: {
        [Op.or]: [
          { user_id: userId },
          { friend_id: userId },
        ],
        status: 'accepted',
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'profile_image'],
        },
        {
          model: User,
          as: 'friend',
          attributes: ['id', 'username', 'profile_image'],
        },
      ],
    });
  }
  
  /**
   * Get friendship by ID
   */
  public async getFriendshipById(id: number) {
    return Friend.findByPk(id);
  }
  
  /**
   * Get friendship between two users
   */
  public async getFriendship(userId: number, friendId: number) {
    return Friend.findOne({
      where: {
        [Op.or]: [
          { user_id: userId, friend_id: friendId },
          { user_id: friendId, friend_id: userId },
        ],
      },
    });
  }
  
  /**
   * Send friend request
   */
  public async sendFriendRequest(userId: number, friendId: number) {
    return Friend.create({
      user_id: userId,
      friend_id: friendId,
      status: 'pending',
    });
  }
  
  /**
   * Get friend requests
   */
  public async getFriendRequests(userId: number) {
    return Friend.findAll({
      where: {
        friend_id: userId,
        status: 'pending',
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'profile_image'],
        },
      ],
    });
  }
  
  /**
   * Accept friend request
   */
  public async acceptFriendRequest(id: number) {
    const friendship = await this.getFriendshipById(id);
    
    if (!friendship) {
      throw new Error('Friendship not found');
    }
    
    await friendship.update({ status: 'accepted' });
    return friendship;
  }
  
  /**
   * Reject friend request
   */
  public async rejectFriendRequest(id: number) {
    const friendship = await this.getFriendshipById(id);
    
    if (!friendship) {
      throw new Error('Friendship not found');
    }
    
    await friendship.update({ status: 'rejected' });
    return friendship;
  }
  
  /**
   * Remove friend
   */
  public async removeFriend(id: number) {
    const friendship = await this.getFriendshipById(id);
    
    if (!friendship) {
      throw new Error('Friendship not found');
    }
    
    await friendship.destroy();
    return true;
  }
  
  /**
   * Block user
   */
  public async blockUser(userId: number, blockId: number) {
    // Check if there's an existing relationship
    const existingFriendship = await this.getFriendship(userId, blockId);
    
    if (existingFriendship) {
      // Update existing relationship to blocked
      await existingFriendship.update({ status: 'blocked' });
      return existingFriendship;
    }
    
    // Create new blocked relationship
    return Friend.create({
      user_id: userId,
      friend_id: blockId,
      status: 'blocked',
    });
  }
  
  /**
   * Check if user is blocked
   */
  public async isBlocked(userId: number, otherUserId: number) {
    const friendship = await Friend.findOne({
      where: {
        [Op.or]: [
          { user_id: userId, friend_id: otherUserId, status: 'blocked' },
          { user_id: otherUserId, friend_id: userId, status: 'blocked' },
        ],
      },
    });
    
    return !!friendship;
  }
  
  /**
   * Get friend status
   */
  public async getFriendStatus(userId: number, otherUserId: number) {
    const friendship = await this.getFriendship(userId, otherUserId);
    
    if (!friendship) {
      return 'none';
    }
    
    return friendship.status;
  }
}
