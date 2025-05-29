import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { Friend } from '../models/friend.model';
import { User } from '../models/user.model';

export class FriendRepository {
  private repository: Repository<Friend>;

  constructor() {
    this.repository = AppDataSource.getRepository(Friend);
  }

  async findById(id: number): Promise<Friend | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user', 'friend']
    });
  }

  async findByUserAndFriend(userId: number, friendId: number): Promise<Friend | null> {
    return this.repository.findOne({
      where: [
        { user_id: userId, friend_id: friendId },
        { user_id: friendId, friend_id: userId }
      ],
      relations: ['user', 'friend']
    });
  }

  async findFriendsByUserId(userId: number, status: string = 'accepted'): Promise<Friend[]> {
    return this.repository.find({
      where: [
        { user_id: userId, status },
        { friend_id: userId, status }
      ],
      relations: ['user', 'friend'],
      order: { updated_at: 'DESC' }
    });
  }

  async findPendingRequestsByUserId(userId: number): Promise<Friend[]> {
    return this.repository.find({
      where: { friend_id: userId, status: 'pending' },
      relations: ['user', 'friend'],
      order: { created_at: 'DESC' }
    });
  }

  async findSentRequestsByUserId(userId: number): Promise<Friend[]> {
    return this.repository.find({
      where: { user_id: userId, status: 'pending' },
      relations: ['user', 'friend'],
      order: { created_at: 'DESC' }
    });
  }

  async create(userId: number, friendId: number): Promise<Friend> {
    const friendship = this.repository.create({
      user_id: userId,
      friend_id: friendId,
      status: 'pending'
    });
    return this.repository.save(friendship);
  }

  async updateStatus(id: number, status: string): Promise<Friend | null> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async isFriend(userId: number, friendId: number): Promise<boolean> {
    const friendship = await this.repository.findOne({
      where: [
        { user_id: userId, friend_id: friendId, status: 'accepted' },
        { user_id: friendId, friend_id: userId, status: 'accepted' }
      ]
    });
    return !!friendship;
  }

  async hasPendingRequest(userId: number, friendId: number): Promise<boolean> {
    const friendship = await this.repository.findOne({
      where: [
        { user_id: userId, friend_id: friendId, status: 'pending' },
        { user_id: friendId, friend_id: userId, status: 'pending' }
      ]
    });
    return !!friendship;
  }
}
