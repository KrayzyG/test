import User from '../models/user.model'; // Keep for type hinting
import { Op } from 'sequelize'; // Keep for type, though not used in placeholder
// import bcrypt from 'bcrypt'; // Commented out: No real password hashing

// Mock user data store (in-memory for placeholder)
const mockUsers: User[] = [
  {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    phone: '1234567890',
    password_hash: 'hashed_password_for_testuser', // Not real
    profile_image: 'https://example.com/profile.jpg',
    is_verified: true,
    is_active: true,
    last_login: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    checkPassword: async (password: string) => password === 'password123', // Mock method
    // Add other User model methods and properties if needed by controllers
  } as User,
  {
    id: 2,
    username: 'anotheruser',
    email: 'another@example.com',
    phone: '0987654321',
    password_hash: 'hashed_password_for_anotheruser',
    profile_image: null,
    is_verified: true,
    is_active: true,
    last_login: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    checkPassword: async (password: string) => password === 'password456',
  } as User,
];


export class UserService {
  /**
   * Find user by ID (Placeholder)
   */
  public async findById(id: number): Promise<User | null> {
    console.log(`[UserService.findById] Placeholder: Searching for user with ID ${id}`);
    // return User.findByPk(id); // Original
    const user = mockUsers.find(u => u.id === id && u.is_active);
    return Promise.resolve(user || null);
  }

  /**
   * Find user by email (Placeholder)
   */
  public async findByEmail(email: string): Promise<User | null> {
    console.log(`[UserService.findByEmail] Placeholder: Searching for user with email ${email}`);
    // return User.findOne({ where: { email } }); // Original
    const user = mockUsers.find(u => u.email === email && u.is_active);
    return Promise.resolve(user || null);
  }

  /**
   * Find user by username (Placeholder)
   */
  public async findByUsername(username: string): Promise<User | null> {
    console.log(`[UserService.findByUsername] Placeholder: Searching for user with username ${username}`);
    // return User.findOne({ where: { username } }); // Original
    const user = mockUsers.find(u => u.username === username && u.is_active);
    return Promise.resolve(user || null);
  }

  /**
   * Find user by email or username (Placeholder)
   */
  public async findByEmailOrUsername(email: string, username: string): Promise<User | null> {
    console.log(`[UserService.findByEmailOrUsername] Placeholder: Searching for user with email ${email} or username ${username}`);
    // return User.findOne({ where: { [Op.or]: [{ email }, { username }] } }); // Original
    const user = mockUsers.find(u => (u.email === email || u.username === username) && u.is_active);
    return Promise.resolve(user || null);
  }

  /**
   * Update user (Placeholder)
   */
  public async update(id: number, data: Partial<User>): Promise<User> {
    console.log(`[UserService.update] Placeholder: Updating user with ID ${id}`);
    // const user = await this.findById(id); // Original
    // if (!user) throw new Error('User not found'); // Original
    // await user.update(data); // Original
    // return user; // Original

    const userIndex = mockUsers.findIndex(u => u.id === id && u.is_active);
    if (userIndex === -1) {
      throw new Error('User not found (placeholder)');
    }
    // Simulate update - in a real placeholder, you might merge objects
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...data, updated_at: new Date() } as User;
    return Promise.resolve(mockUsers[userIndex]);
  }

  /**
   * Delete user (Placeholder - soft delete by marking inactive)
   */
  public async delete(id: number): Promise<boolean> {
    console.log(`[UserService.delete] Placeholder: Deleting user with ID ${id}`);
    // const user = await this.findById(id); // Original
    // if (!user) throw new Error('User not found'); // Original
    // await user.update({ is_active: false }); // Original
    // return true; // Original

    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found (placeholder)');
    }
    mockUsers[userIndex].is_active = false;
    return Promise.resolve(true);
  }

  /**
   * Update last login (Placeholder)
   */
  public async updateLastLogin(id: number): Promise<User> {
    console.log(`[UserService.updateLastLogin] Placeholder: Updating last login for user ID ${id}`);
    // const user = await this.findById(id); // Original
    // if (!user) throw new Error('User not found'); // Original
    // await user.update({ last_login: new Date() }); // Original
    // return user; // Original

    const userIndex = mockUsers.findIndex(u => u.id === id && u.is_active);
    if (userIndex === -1) {
      throw new Error('User not found (placeholder)');
    }
    mockUsers[userIndex].last_login = new Date();
    return Promise.resolve(mockUsers[userIndex]);
  }

  /**
   * Search users (Placeholder)
   */
  public async search(query: string, currentUserId: number): Promise<User[]> {
    console.log(`[UserService.search] Placeholder: Searching for users with query "${query}"`);
    // return User.findAll({ ... }); // Original
    if (!query) return Promise.resolve([]);

    const results = mockUsers.filter(
      u =>
        u.id !== currentUserId &&
        u.is_active &&
        (u.username.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase())),
    );
    return Promise.resolve(results.slice(0, 20)); // Simulate limit
  }

  /**
   * Change password (Placeholder)
   */
  public async changePassword(id: number, currentPassword: string, newPassword: string): Promise<boolean> {
    console.log(`[UserService.changePassword] Placeholder: Changing password for user ID ${id}`);
    // const user = await this.findById(id); // Original
    // if (!user) throw new Error('User not found'); // Original
    // const isMatch = await user.checkPassword(currentPassword); // Original
    // if (!isMatch) return false; // Original
    // await user.update({ password_hash: await User.hashPassword(newPassword) }); // Original
    // return true; // Original

    const user = mockUsers.find(u => u.id === id && u.is_active);
    if (!user) {
      throw new Error('User not found (placeholder)');
    }
    // Simulate password check
    if (await user.checkPassword(currentPassword)) {
      // user.password_hash = `hashed_${newPassword}`; // Simulate hashing
      console.log('Password changed successfully (placeholder)');
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
}
