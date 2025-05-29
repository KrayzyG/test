import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { Photo } from '../models/photo.model';

export class PhotoRepository {
  private repository: Repository<Photo>;

  constructor() {
    this.repository = AppDataSource.getRepository(Photo);
  }

  async findById(id: number): Promise<Photo | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['sender']
    });
  }

  async findBySenderId(senderId: number, page: number = 1, limit: number = 20): Promise<[Photo[], number]> {
    return this.repository.findAndCount({
      where: { sender_id: senderId },
      relations: ['sender', 'recipients', 'recipients.recipient'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit
    });
  }

  async create(photoData: Partial<Photo>): Promise<Photo> {
    const photo = this.repository.create(photoData);
    return this.repository.save(photo);
  }

  async update(id: number, photoData: Partial<Photo>): Promise<Photo | null> {
    await this.repository.update(id, photoData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findLatestBySenderId(senderId: number): Promise<Photo | null> {
    return this.repository.findOne({
      where: { sender_id: senderId },
      relations: ['sender', 'recipients', 'recipients.recipient'],
      order: { created_at: 'DESC' }
    });
  }

  async findByRecipientId(recipientId: number, page: number = 1, limit: number = 20): Promise<[Photo[], number]> {
    const query = `
      SELECT p.*, pr.viewed_at
      FROM photos p
      JOIN photo_recipients pr ON p.id = pr.photo_id
      WHERE pr.recipient_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const countQuery = `
      SELECT COUNT(*) as count
      FROM photos p
      JOIN photo_recipients pr ON p.id = pr.photo_id
      WHERE pr.recipient_id = ?
    `;
    
    const photos = await this.repository.query(query, [
      recipientId,
      limit,
      (page - 1) * limit
    ]);
    
    const [{ count }] = await this.repository.query(countQuery, [recipientId]);
    
    return [photos, parseInt(count)];
  }
}
