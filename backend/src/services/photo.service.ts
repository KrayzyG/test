import Photo from '../models/photo.model'; // Keep for type hinting
import PhotoRecipient from '../models/photo-recipient.model'; // Keep for type hinting
import User from '../models/user.model'; // Keep for type hinting
import { Op } from 'sequelize'; // Keep for type, though not used in placeholder
// import sequelize from '../config/database.config'; // Commented out: No real DB transactions

// Mock data stores
const mockPhotos: Photo[] = [
  {
    id: 101,
    sender_id: 1,
    image_url: 'https://storage.placeholder.com/mock_photo1.jpg',
    caption: 'Hello from user 1!',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000),
    sender: { id: 1, username: 'testuser', profile_image: 'https://example.com/profile.jpg' } as User,
    recipients: [] as PhotoRecipient[], // Will be populated by mockPhotoRecipients
  } as Photo,
  {
    id: 102,
    sender_id: 2,
    image_url: 'https://storage.placeholder.com/mock_photo2.jpg',
    caption: 'Another one from user 2!',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000),
    sender: { id: 2, username: 'anotheruser', profile_image: null } as User,
    recipients: [] as PhotoRecipient[],
  } as Photo,
];
let nextPhotoId = 103;

const mockPhotoRecipients: PhotoRecipient[] = [
  { id: 201, photo_id: 101, recipient_id: 2, viewed_at: null, created_at: new Date(), updated_at: new Date(), photo: mockPhotos[0], recipient: {id: 2, username: 'anotheruser'} as User } as PhotoRecipient,
  { id: 202, photo_id: 101, recipient_id: 3, viewed_at: new Date(), created_at: new Date(), updated_at: new Date(), photo: mockPhotos[0], recipient: {id: 3, username: 'user3'} as User } as PhotoRecipient,
  { id: 203, photo_id: 102, recipient_id: 1, viewed_at: null, created_at: new Date(), updated_at: new Date(), photo: mockPhotos[1], recipient: {id: 1, username: 'testuser'} as User } as PhotoRecipient,
];
// Populate recipients in mockPhotos
mockPhotos[0].recipients = [mockPhotoRecipients[0], mockPhotoRecipients[1]];
mockPhotos[1].recipients = [mockPhotoRecipients[2]];

let nextPhotoRecipientId = 204;


export class PhotoService {
  /**
   * Create a new photo (Placeholder)
   * Note: This service method is for the moment creation flow which is already placeholder.
   * The direct photo upload will be handled differently in the controller.
   */
  public async createPhoto(photoData: {
    sender_id: number;
    image_url: string;
    caption: string | null;
    recipients: number[];
  }): Promise<Photo> {
    console.log(`[PhotoService.createPhoto] Placeholder: Creating photo for sender ID ${photoData.sender_id}`);
    // const transaction = await sequelize.transaction(); // Original
    // try { ... photo = await Photo.create({ ... }); ... await transaction.commit(); ... } // Original
    // catch (error) { await transaction.rollback(); throw error; } // Original

    const newPhoto: Photo = {
      id: nextPhotoId++,
      sender_id: photoData.sender_id,
      image_url: photoData.image_url,
      caption: photoData.caption,
      created_at: new Date(),
      updated_at: new Date(),
      // Mock sender if needed based on controller usage
      sender: { id: photoData.sender_id, username: `user${photoData.sender_id}` } as User,
      recipients: [], // Placeholder for recipients
    } as Photo;

    const createdRecipients: PhotoRecipient[] = photoData.recipients.map(recipientId => ({
      id: nextPhotoRecipientId++,
      photo_id: newPhoto.id,
      recipient_id: recipientId,
      viewed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
      photo: newPhoto, // Link back
      recipient: { id: recipientId, username: `user${recipientId}` } as User,
    } as PhotoRecipient));

    newPhoto.recipients = createdRecipients;
    mockPhotos.push(newPhoto);
    mockPhotoRecipients.push(...createdRecipients);

    return Promise.resolve(newPhoto);
  }

  /**
   * Get photo by ID (Placeholder)
   */
  public async getPhotoById(id: number): Promise<Photo | null> {
    console.log(`[PhotoService.getPhotoById] Placeholder: Getting photo by ID ${id}`);
    // return Photo.findByPk(id); // Original
    const photo = mockPhotos.find(p => p.id === id);
    return Promise.resolve(photo || null);
  }

  /**
   * Get photo recipient by ID (Placeholder)
   */
  public async getPhotoRecipientById(id: number): Promise<PhotoRecipient | null> {
    console.log(`[PhotoService.getPhotoRecipientById] Placeholder: Getting photo recipient by ID ${id}`);
    // return PhotoRecipient.findByPk(id); // Original
    const recipient = mockPhotoRecipients.find(pr => pr.id === id);
    return Promise.resolve(recipient || null);
  }

  /**
   * Get sent photos (Placeholder)
   */
  public async getSentPhotos(userId: number, page: number = 1, limit: number = 20): Promise<{rows: Photo[], count: number}> {
    console.log(`[PhotoService.getSentPhotos] Placeholder: Getting sent photos for user ID ${userId}, page ${page}, limit ${limit}`);
    // const photos = await Photo.findAndCountAll({ ... }); // Original
    // return photos; // Original
    const userSentPhotos = mockPhotos.filter(p => p.sender_id === userId)
                                     .sort((a,b) => b.created_at.getTime() - a.created_at.getTime());
    const count = userSentPhotos.length;
    const offset = (page - 1) * limit;
    const rows = userSentPhotos.slice(offset, offset + limit);
    return Promise.resolve({ rows, count });
  }

  /**
   * Get received photos (Placeholder)
   */
  public async getReceivedPhotos(userId: number, page: number = 1, limit: number = 20): Promise<{rows: PhotoRecipient[], count: number}> {
    console.log(`[PhotoService.getReceivedPhotos] Placeholder: Getting received photos for user ID ${userId}, page ${page}, limit ${limit}`);
    // const photoRecipients = await PhotoRecipient.findAndCountAll({ ... }); // Original
    // return photoRecipients; // Original
    const userReceived = mockPhotoRecipients.filter(pr => pr.recipient_id === userId)
                                           .sort((a,b) => b.created_at.getTime() - a.created_at.getTime());
    const count = userReceived.length;
    const offset = (page - 1) * limit;
    const rows = userReceived.slice(offset, offset + limit);
    // Ensure the 'photo' object within each recipient entry has its 'sender' populated for the controller
    rows.forEach(row => {
      if (row.photo && !row.photo.sender) {
         const originalPhoto = mockPhotos.find(p => p.id === row.photo_id);
         if (originalPhoto) row.photo.sender = originalPhoto.sender;
      }
    });
    return Promise.resolve({ rows, count });
  }

  /**
   * Get latest received photo (Placeholder)
   */
  public async getLatestReceivedPhoto(userId: number): Promise<PhotoRecipient | null> {
    console.log(`[PhotoService.getLatestReceivedPhoto] Placeholder: Getting latest received photo for user ID ${userId}`);
    // return PhotoRecipient.findOne({ ... }); // Original
    const received = mockPhotoRecipients
      .filter(pr => pr.recipient_id === userId)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    
    const latest = received.length > 0 ? received[0] : null;
    if (latest && latest.photo && !latest.photo.sender) {
        const originalPhoto = mockPhotos.find(p => p.id === latest.photo_id);
        if (originalPhoto) latest.photo.sender = originalPhoto.sender;
    }
    return Promise.resolve(latest);
  }

  /**
   * Mark photo as viewed (Placeholder)
   */
  public async markPhotoAsViewed(id: number): Promise<PhotoRecipient> {
    console.log(`[PhotoService.markPhotoAsViewed] Placeholder: Marking photo recipient ID ${id} as viewed`);
    // const photoRecipient = await this.getPhotoRecipientById(id); // Original
    // if (!photoRecipient) throw new Error('Photo recipient not found'); // Original
    // await photoRecipient.update({ viewed_at: new Date() }); // Original
    // return photoRecipient; // Original
    const recipient = mockPhotoRecipients.find(pr => pr.id === id);
    if (!recipient) {
      throw new Error('Photo recipient not found (placeholder)');
    }
    if (!recipient.viewed_at) { // Only mark if not already viewed
        recipient.viewed_at = new Date();
        recipient.updated_at = new Date();
    }
    return Promise.resolve(recipient);
  }

  /**
   * Delete photo (Placeholder)
   */
  public async deletePhoto(id: number): Promise<boolean> {
    console.log(`[PhotoService.deletePhoto] Placeholder: Deleting photo ID ${id}`);
    // const photo = await this.getPhotoById(id); // Original
    // if (!photo) throw new Error('Photo not found'); // Original
    // await photo.destroy(); // Original - This would also handle cascading deletes of PhotoRecipients via DB constraints
    // return true; // Original

    const index = mockPhotos.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Photo not found (placeholder)');
    }
    mockPhotos.splice(index, 1);
    // Also remove associated recipients from mockPhotoRecipients
    const initialRecipientCount = mockPhotoRecipients.length;
    for (let i = mockPhotoRecipients.length - 1; i >= 0; i--) {
        if (mockPhotoRecipients[i].photo_id === id) {
            mockPhotoRecipients.splice(i, 1);
        }
    }
    console.log(`Deleted ${initialRecipientCount - mockPhotoRecipients.length} associated recipients for photo ID ${id}`);
    return Promise.resolve(true);
  }

  /**
   * Get photo recipients (Placeholder)
   */
  public async getPhotoRecipients(photoId: number): Promise<PhotoRecipient[]> {
    console.log(`[PhotoService.getPhotoRecipients] Placeholder: Getting recipients for photo ID ${photoId}`);
    // return PhotoRecipient.findAll({ where: { photo_id: photoId }, include: [...] }); // Original
    const recipients = mockPhotoRecipients.filter(pr => pr.photo_id === photoId);
    return Promise.resolve(recipients);
  }
}
