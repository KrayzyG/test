import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { User } from '../models/user.model';

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({ where: { username } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.repository.findOne({ where: { phone } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    await this.repository.update(id, userData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findAll(page: number = 1, limit: number = 10): Promise<[User[], number]> {
    return this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' }
    });
  }

  async searchByUsername(query: string, page: number = 1, limit: number = 10): Promise<[User[], number]> {
    return this.repository.findAndCount({
      where: { username: `%${query}%` },
      skip: (page - 1) * limit,
      take: limit,
      order: { username: 'ASC' }
    });
  }

  async isEmailVerified(id: number): Promise<boolean> {
    const user = await this.findById(id);
    return user ? user.is_verified : false;
  }

  async markEmailAsVerified(id: number): Promise<User | null> {
    await this.repository.update(id, { is_verified: true });
    return this.findById(id);
  }
}
