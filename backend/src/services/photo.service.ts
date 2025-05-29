import Photo from '../models/photo.model';
import PhotoRecipient from '../models/photo-recipient.model';
import User from '../models/user.model';
import { Op } from 'sequelize';
import sequelize from '../config/database.config';

export class PhotoService {
  /**
   * Create a new photo
   */
  public async createPhoto(photoData: {
    sender_id: number;
    image_url: string;
    caption: string | null;
    recipients: number[];
  }) {
    // Start transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Create photo
      const photo = await Photo.create(
        {
          sender_id: photoData.sender_id,
          image_url: photoData.image_url,
          caption: photoData.caption,
        },
        { transaction }
      );
      
      // Create photo recipients
      const photoRecipients = await Promise.all(
        photoData.recipients.map(recipientId =>
          PhotoRecipient.create(
            {
              photo_id: photo.id,
              recipient_id: recipientId,
            },
            { transaction }
          )
        )
      );
      
      // Commit transaction
      await transaction.commit();
      
      // Return photo with recipients
      photo.recipients = photoRecipients;
      return photo;
    } catch (error) {
      // Rollback transaction
      await transaction.rollback();
      throw error;
    }
  }
  
  /**
   * Get photo by ID
   */
  public async getPhotoById(id: number) {
    return Photo.findByPk(id);
  }
  
  /**
   * Get photo recipient by ID
   */
  public async getPhotoRecipientById(id: number) {
    return PhotoRecipient.findByPk(id);
  }
  
  /**
   * Get sent photos
   */
  public async getSentPhotos(userId: number, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    
    const photos = await Photo.findAndCountAll({
      where: {
        sender_id: userId,
      },
      include: [
        {
          model: PhotoRecipient,
          as: 'recipients',
          include: [
            {
              model: User,
              as: 'recipient',
              attributes: ['id', 'username', 'profile_image'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });
    
    return photos;
  }
  
  /**
   * Get received photos
   */
  public async getReceivedPhotos(userId: number, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    
    const photoRecipients = await PhotoRecipient.findAndCountAll({
      where: {
        recipient_id: userId,
      },
      include: [
        {
          model: Photo,
          as: 'photo',
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'username', 'profile_image'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });
    
    return photoRecipients;
  }
  
  /**
   * Get latest received photo
   */
  public async getLatestReceivedPhoto(userId: number) {
    return PhotoRecipient.findOne({
      where: {
        recipient_id: userId,
      },
      include: [
        {
          model: Photo,
          as: 'photo',
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'username', 'profile_image'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }
  
  /**
   * Mark photo as viewed
   */
  public async markPhotoAsViewed(id: number) {
    const photoRecipient = await this.getPhotoRecipientById(id);
    
    if (!photoRecipient) {
      throw new Error('Photo recipient not found');
    }
    
    await photoRecipient.update({ viewed_at: new Date() });
    return photoRecipient;
  }
  
  /**
   * Delete photo
   */
  public async deletePhoto(id: number) {
    const photo = await this.getPhotoById(id);
    
    if (!photo) {
      throw new Error('Photo not found');
    }
    
    await photo.destroy();
    return true;
  }
  
  /**
   * Get photo recipients
   */
  public async getPhotoRecipients(photoId: number) {
    return PhotoRecipient.findAll({
      where: {
        photo_id: photoId,
      },
      include: [
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'username', 'profile_image'],
        },
      ],
    });
  }
}
