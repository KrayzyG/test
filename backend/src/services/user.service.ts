import User from '../models/user.model';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

export class UserService {
  /**
   * Find user by ID
   */
  public async findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }
  
  /**
   * Find user by email
   */
  public async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }
  
  /**
   * Find user by username
   */
  public async findByUsername(username: string): Promise<User | null> {
    return User.findOne({ where: { username } });
  }
  
  /**
   * Find user by email or username
   */
  public async findByEmailOrUsername(email: string, username: string): Promise<User | null> {
    return User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });
  }
  
  /**
   * Update user
   */
  public async update(id: number, data: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    await user.update(data);
    return user;
  }
  
  /**
   * Delete user
   */
  public async delete(id: number): Promise<boolean> {
    const user = await this.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    await user.update({ is_active: false });
    return true;
  }
  
  /**
   * Update last login
   */
  public async updateLastLogin(id: number): Promise<User> {
    const user = await this.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    await user.update({ last_login: new Date() });
    return user;
  }
  
  /**
   * Search users
   */
  public async search(query: string, currentUserId: number): Promise<User[]> {
    return User.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { username: { [Op.like]: `%${query}%` } },
              { email: { [Op.like]: `%${query}%` } },
            ],
          },
          { id: { [Op.ne]: currentUserId } }, // Exclude current user
          { is_active: true }, // Only active users
        ],
      },
      limit: 20,
    });
  }
  
  /**
   * Change password
   */
  public async changePassword(id: number, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Verify current password
    const isMatch = await user.checkPassword(currentPassword);
    
    if (!isMatch) {
      return false;
    }
    
    // Update password
    await user.update({ password_hash: await User.hashPassword(newPassword) });
    return true;
  }
}
