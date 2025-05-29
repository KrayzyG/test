import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { PhotoRecipient } from '../models/photo-recipient.model';

export class PhotoRecipientRepository {
  private repository: Repository<PhotoRecipient>;

  constructor() {
    this.repository = AppDataSource.getRepository(PhotoRecipient);
  }

  async findById(id: number): Promise<PhotoRecipient | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['photo', 'recipient']
    });
  }

  async findByPhotoAndRecipient(photoId: number, recipientId: number): Promise<PhotoRecipient | null> {
    return this.repository.findOne({
      where: { photo_id: photoId, recipient_id: recipientId },
      relations: ['photo', 'recipient']
    });
  }

  async findByPhotoId(photoId: number): Promise<PhotoRecipient[]> {
    return this.repository.find({
      where: { photo_id: photoId },
      relations: ['recipient']
    });
  }

  async findByRecipientId(recipientId: number, page: number = 1, limit: number = 20): Promise<[PhotoRecipient[], number]> {
    return this.repository.findAndCount({
      where: { recipient_id: recipientId },
      relations: ['photo', 'photo.sender'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit
    });
  }

  async create(photoRecipientData: Partial<PhotoRecipient>): Promise<PhotoRecipient> {
    const photoRecipient = this.repository.create(photoRecipientData);
    return this.repository.save(photoRecipient);
  }

  async createMany(photoRecipients: Partial<PhotoRecipient>[]): Promise<PhotoRecipient[]> {
    const createdPhotoRecipients = this.repository.create(photoRecipients);
    return this.repository.save(createdPhotoRecipients);
  }

  async markAsViewed(id: number): Promise<PhotoRecipient | null> {
    await this.repository.update(id, { 
      viewed_at: new Date() 
    });
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async deleteByPhotoId(photoId: number): Promise<boolean> {
    const result = await this.repository.delete({ photo_id: photoId });
    return result.affected ? result.affected > 0 : false;
  }

  async findUnviewedByRecipientId(recipientId: number): Promise<PhotoRecipient[]> {
    return this.repository.find({
      where: { 
        recipient_id: recipientId,
        viewed_at: null
      },
      relations: ['photo', 'photo.sender'],
      order: { created_at: 'DESC' }
    });
  }
}
