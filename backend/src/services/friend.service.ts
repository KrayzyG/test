import Friend from '../models/friend.model'; // Keep for type hinting
import User from '../models/user.model'; // Keep for type hinting
import { Op } from 'sequelize'; // Keep for type, though not used in placeholder

// Mock data store for friendships
const mockFriendships: Friend[] = [
  {
    id: 1,
    user_id: 1, // user 'testuser'
    friend_id: 2, // user 'anotheruser'
    status: 'accepted',
    created_at: new Date(),
    updated_at: new Date(),
    user: { id: 1, username: 'testuser', profile_image: 'https://example.com/profile.jpg' } as User,
    friend: { id: 2, username: 'anotheruser', profile_image: null } as User,
  } as Friend,
  {
    id: 2,
    user_id: 3, // Some other user
    friend_id: 1, // user 'testuser'
    status: 'pending',
    created_at: new Date(),
    updated_at: new Date(),
    user: { id: 3, username: 'pendingfriend', profile_image: 'https://example.com/pending.jpg' } as User,
    friend: { id: 1, username: 'testuser', profile_image: 'https://example.com/profile.jpg' } as User,
  } as Friend,
];
let nextFriendshipId = 3;

export class FriendService {
  /**
   * Get friends list (Placeholder)
   */
  public async getFriends(userId: number): Promise<Friend[]> {
    console.log(`[FriendService.getFriends] Placeholder: Getting friends for user ID ${userId}`);
    // Original: return Friend.findAll({ where: { [Op.or]: [{ user_id: userId }, { friend_id: userId }], status: 'accepted' }, include: [...] });
    const friends = mockFriendships.filter(
      f => (f.user_id === userId || f.friend_id === userId) && f.status === 'accepted',
    );
    return Promise.resolve(friends);
  }

  /**
   * Get friendship by ID (Placeholder)
   */
  public async getFriendshipById(id: number): Promise<Friend | null> {
    console.log(`[FriendService.getFriendshipById] Placeholder: Getting friendship by ID ${id}`);
    // Original: return Friend.findByPk(id);
    const friendship = mockFriendships.find(f => f.id === id);
    return Promise.resolve(friendship || null);
  }

  /**
   * Get friendship between two users (Placeholder)
   */
  public async getFriendship(userId: number, friendId: number): Promise<Friend | null> {
    console.log(`[FriendService.getFriendship] Placeholder: Getting friendship between user ID ${userId} and ${friendId}`);
    // Original: return Friend.findOne({ where: { [Op.or]: [{ user_id: userId, friend_id: friendId }, { user_id: friendId, friend_id: userId }] } });
    const friendship = mockFriendships.find(
      f =>
        (f.user_id === userId && f.friend_id === friendId) ||
        (f.user_id === friendId && f.friend_id === userId),
    );
    return Promise.resolve(friendship || null);
  }

  /**
   * Send friend request (Placeholder)
   */
  public async sendFriendRequest(userId: number, friendId: number): Promise<Friend> {
    console.log(`[FriendService.sendFriendRequest] Placeholder: Sending friend request from user ID ${userId} to ${friendId}`);
    // Original: return Friend.create({ user_id: userId, friend_id: friendId, status: 'pending' });
    const newFriendship: Friend = {
      id: nextFriendshipId++,
      user_id: userId,
      friend_id: friendId,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
      // Mock user/friend objects if needed by controller response, otherwise can be omitted for simplicity
      user: { id: userId, username: `user${userId}`, profile_image: null } as User,
      friend: { id: friendId, username: `user${friendId}`, profile_image: null } as User,
    } as Friend;
    mockFriendships.push(newFriendship);
    return Promise.resolve(newFriendship);
  }

  /**
   * Get friend requests (Placeholder)
   */
  public async getFriendRequests(userId: number): Promise<Friend[]> {
    console.log(`[FriendService.getFriendRequests] Placeholder: Getting friend requests for user ID ${userId}`);
    // Original: return Friend.findAll({ where: { friend_id: userId, status: 'pending' }, include: [...] });
    const requests = mockFriendships.filter(f => f.friend_id === userId && f.status === 'pending');
    return Promise.resolve(requests);
  }

  /**
   * Accept friend request (Placeholder)
   */
  public async acceptFriendRequest(id: number): Promise<Friend> {
    console.log(`[FriendService.acceptFriendRequest] Placeholder: Accepting friend request ID ${id}`);
    // const friendship = await this.getFriendshipById(id); // Original
    // if (!friendship) throw new Error('Friendship not found'); // Original
    // await friendship.update({ status: 'accepted' }); // Original
    // return friendship; // Original
    const friendship = mockFriendships.find(f => f.id === id && f.status === 'pending');
    if (!friendship) {
      throw new Error('Friendship not found or not pending (placeholder)');
    }
    friendship.status = 'accepted';
    friendship.updated_at = new Date();
    return Promise.resolve(friendship);
  }

  /**
   * Reject friend request (Placeholder)
   */
  public async rejectFriendRequest(id: number): Promise<Friend> {
    console.log(`[FriendService.rejectFriendRequest] Placeholder: Rejecting friend request ID ${id}`);
    // const friendship = await this.getFriendshipById(id); // Original
    // if (!friendship) throw new Error('Friendship not found'); // Original
    // await friendship.update({ status: 'rejected' }); // Original
    // return friendship; // Original
    const friendship = mockFriendships.find(f => f.id === id && f.status === 'pending');
    if (!friendship) {
      throw new Error('Friendship not found or not pending (placeholder)');
    }
    friendship.status = 'rejected';
    friendship.updated_at = new Date();
    return Promise.resolve(friendship);
  }

  /**
   * Remove friend (Placeholder)
   */
  public async removeFriend(id: number): Promise<boolean> {
    console.log(`[FriendService.removeFriend] Placeholder: Removing friend with friendship ID ${id}`);
    // const friendship = await this.getFriendshipById(id); // Original
    // if (!friendship) throw new Error('Friendship not found'); // Original
    // await friendship.destroy(); // Original
    // return true; // Original
    const index = mockFriendships.findIndex(f => f.id === id && f.status === 'accepted');
    if (index === -1) {
      throw new Error('Accepted friendship not found (placeholder)');
    }
    mockFriendships.splice(index, 1);
    return Promise.resolve(true);
  }

  /**
   * Block user (Placeholder)
   */
  public async blockUser(userId: number, blockId: number): Promise<Friend> {
    console.log(`[FriendService.blockUser] Placeholder: User ID ${userId} blocking user ID ${blockId}`);
    // const existingFriendship = await this.getFriendship(userId, blockId); // Original
    // if (existingFriendship) { // Original
    //   await existingFriendship.update({ status: 'blocked' }); // Original
    //   return existingFriendship; // Original
    // } // Original
    // return Friend.create({ user_id: userId, friend_id: blockId, status: 'blocked' }); // Original

    let friendship = mockFriendships.find(f => (f.user_id === userId && f.friend_id === blockId) || (f.user_id === blockId && f.friend_id === userId));
    if (friendship) {
      friendship.status = 'blocked';
      friendship.user_id = userId; // Ensure blocker is user_id
      friendship.friend_id = blockId;
      friendship.updated_at = new Date();
    } else {
      friendship = {
        id: nextFriendshipId++,
        user_id: userId,
        friend_id: blockId,
        status: 'blocked',
        created_at: new Date(),
        updated_at: new Date(),
      } as Friend;
      mockFriendships.push(friendship);
    }
    return Promise.resolve(friendship);
  }

  /**
   * Check if user is blocked (Placeholder)
   */
  public async isBlocked(userId: number, otherUserId: number): Promise<boolean> {
    console.log(`[FriendService.isBlocked] Placeholder: Checking if user ID ${userId} and ${otherUserId} have a blocked status`);
    // const friendship = await Friend.findOne({ where: { [Op.or]: [...] status: 'blocked' ... } }); // Original
    // return !!friendship; // Original
    const blocked = mockFriendships.some(
      f =>
        f.status === 'blocked' &&
        ((f.user_id === userId && f.friend_id === otherUserId) ||
          (f.user_id === otherUserId && f.friend_id === userId)),
    );
    return Promise.resolve(blocked);
  }

  /**
   * Get friend status (Placeholder)
   */
  public async getFriendStatus(userId: number, otherUserId: number): Promise<string> {
    console.log(`[FriendService.getFriendStatus] Placeholder: Getting friend status between user ID ${userId} and ${otherUserId}`);
    // const friendship = await this.getFriendship(userId, otherUserId); // Original
    // if (!friendship) return 'none'; // Original
    // return friendship.status; // Original
    const friendship = mockFriendships.find(
      f =>
        (f.user_id === userId && f.friend_id === otherUserId) ||
        (f.user_id === otherUserId && f.friend_id === userId),
    );
    return Promise.resolve(friendship ? friendship.status : 'none');
  }
}
