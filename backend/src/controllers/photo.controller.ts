import { Request, Response, NextFunction } from 'express';
import { PhotoService } from '../services/photo.service'; // Uses placeholder service
import { NotificationService } from '../services/notification.service'; // Uses placeholder service
import { AuthRequest } from '../types/express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
// import { firebaseStorage } from '../config/firebase.config'; // Commented out: No Firebase interaction

const photoService = new PhotoService(); // Instantiates placeholder service
const notificationService = new NotificationService(); // Instantiates placeholder service

// Configure multer for file uploads (can remain as is, file content won't be uploaded to Firebase)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error('Only image files are allowed'));
  },
}).single('image');

export class PhotoController {
  /**
   * Upload and send a new photo (Placeholder for Firebase and DB)
   */
  public async uploadPhoto(req: AuthRequest, res: Response, next: NextFunction) {
    // Use multer to handle file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: err.message,
        });
      }
      
      try {
        const userId = req.user?.id;
        
        if (!userId) {
          return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Unauthorized',
          });
        }
        
        const { caption } = req.body; // recipients will be parsed separately
        let { recipients } = req.body; // mutable
        
        if (!req.file) {
          return res.status(400).json({
            status: 'error',
            code: 400,
            message: 'Image file is required',
          });
        }

        // Ensure recipients is parsed correctly if it's a JSON string
        let recipientIds: number[];
        try {
            if (typeof recipients === 'string') {
                recipientIds = JSON.parse(recipients).map((id: string | number) => parseInt(String(id)));
            } else if (Array.isArray(recipients)) {
                recipientIds = recipients.map((id: string | number) => parseInt(String(id)));
            } else {
                throw new Error('Recipients must be an array or a JSON string array');
            }
            if (recipientIds.length === 0) {
                 return res.status(400).json({
                    status: 'error',
                    code: 400,
                    message: 'At least one recipient is required',
                });
            }
        } catch (parseError) {
             return res.status(400).json({
                status: 'error',
                code: 400,
                message: 'Invalid recipients format. Must be an array of IDs.',
            });
        }

        // Placeholder: Generate a mock Firebase-like URL
        console.log('[PhotoController.uploadPhoto] Placeholder: Simulating Firebase upload.');
        const mockFilename = `photos/${userId}/${uuidv4()}-${Date.now()}${path.extname(req.file.originalname)}`;
        const mockImageUrl = `https://storage.placeholder.com/mock-bucket/${mockFilename}`;
        
        // Placeholder: Simulate creating photo record using placeholder service
        const photo = await photoService.createPhoto({
          sender_id: userId,
          image_url: mockImageUrl, // Use mock URL
          caption: caption || null,
          recipients: recipientIds,
        });
        
        // Placeholder: Simulate creating notifications using placeholder service
        console.log(`[PhotoController.uploadPhoto] Placeholder: Simulating notification creation for ${recipientIds.length} recipients.`);
        for (const recipientId of recipientIds) {
          await notificationService.createNotification({ // Uses placeholder
            user_id: recipientId,
            type: 'photo',
            reference_id: photo.id, // Use ID from mock photo
            content: `${req.user?.username} sent you a photo (placeholder)`,
          });
        }
            
        return res.status(201).json({
          status: 'success',
          data: {
            photo: { // Return mock photo data
              id: photo.id,
              image_url: photo.image_url,
              caption: photo.caption,
              created_at: photo.created_at,
              recipients: photo.recipients.map(recipient => ({
                id: recipient.id, // This is PhotoRecipient ID
                user_id: recipient.recipient_id, // This is the actual recipient user ID
              })),
            },
          },
        });

      } catch (error) {
        next(error);
      }
    });
  }
  
  /**
   * Get sent photos history (Using Placeholder Service)
   */
  public async getSentPhotos(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }
      
      const { page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      
      const photosData = await photoService.getSentPhotos( // Uses placeholder
        userId,
        pageNum,
        limitNum
      );
      
      return res.status(200).json({
        status: 'success',
        data: {
          photos: photosData.rows.map(photo => ({ // Map mock data
            id: photo.id,
            image_url: photo.image_url,
            caption: photo.caption,
            created_at: photo.created_at,
            recipients: photo.recipients.map(recipient => ({
              id: recipient.id, // PhotoRecipient ID
              user_id: recipient.recipient_id, // Actual recipient User ID
              viewed_at: recipient.viewed_at,
            })),
          })),
          pagination: {
            total: photosData.count,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(photosData.count / limitNum),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get received photos (Using Placeholder Service)
   */
  public async getReceivedPhotos(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }
      
      const { page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      
      const receivedPhotosData = await photoService.getReceivedPhotos( // Uses placeholder
        userId,
        pageNum,
        limitNum
      );
      
      return res.status(200).json({
        status: 'success',
        data: {
          photos: receivedPhotosData.rows.map(recipientEntry => ({ // Map mock data
            id: recipientEntry.photo.id,
            image_url: recipientEntry.photo.image_url,
            caption: recipientEntry.photo.caption,
            created_at: recipientEntry.photo.created_at,
            sender: {
              id: recipientEntry.photo.sender.id,
              username: recipientEntry.photo.sender.username,
              profile_image: recipientEntry.photo.sender.profile_image,
            },
            viewed_at: recipientEntry.viewed_at,
          })),
          pagination: {
            total: receivedPhotosData.count,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(receivedPhotosData.count / limitNum),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get latest photo for widget (Using Placeholder Service)
   */
  public async getLatestPhoto(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }
      
      const photoRecipient = await photoService.getLatestReceivedPhoto(userId); // Uses placeholder
      
      if (!photoRecipient || !photoRecipient.photo) { // Check photoRecipient.photo as well
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'No photos found (placeholder)',
        });
      }
      
      // Placeholder: Simulate marking as viewed
      if (!photoRecipient.viewed_at) {
        await photoService.markPhotoAsViewed(photoRecipient.id); // Uses placeholder
        photoRecipient.viewed_at = new Date(); // Reflect change in returned data
      }
      
      return res.status(200).json({
        status: 'success',
        data: {
          photo: { // Map mock data
            id: photoRecipient.photo.id,
            image_url: photoRecipient.photo.image_url,
            caption: photoRecipient.photo.caption,
            created_at: photoRecipient.photo.created_at,
            sender: {
              id: photoRecipient.photo.sender.id,
              username: photoRecipient.photo.sender.username,
              profile_image: photoRecipient.photo.sender.profile_image,
            },
            viewed_at: photoRecipient.viewed_at,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete a photo (Using Placeholder Service)
   */
  public async deletePhoto(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }
      
      const { id } = req.params;
      const photoIdNum = parseInt(id);

      if (!photoIdNum) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Photo ID is required and must be a number',
        });
      }
      
      const photo = await photoService.getPhotoById(photoIdNum); // Uses placeholder
      
      if (!photo) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Photo not found (placeholder)',
        });
      }
      
      if (photo.sender_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to delete this photo (placeholder)',
        });
      }
      
      await photoService.deletePhoto(photoIdNum); // Uses placeholder
      
      return res.status(200).json({
        status: 'success',
        message: 'Photo deleted successfully (placeholder)',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Mark photo as viewed (Using Placeholder Service)
   */
  public async markPhotoAsViewed(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
        });
      }
      
      const { id } = req.params; // This ID is PhotoRecipient ID
      const recipientIdNum = parseInt(id);
      
      if (!recipientIdNum) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Photo recipient ID is required and must be a number',
        });
      }
      
      const recipient = await photoService.getPhotoRecipientById(recipientIdNum); // Uses placeholder
      
      if (!recipient) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Photo recipient not found (placeholder)',
        });
      }
      
      if (recipient.recipient_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to mark this photo as viewed (placeholder)',
        });
      }
      
      await photoService.markPhotoAsViewed(recipientIdNum); // Uses placeholder
      
      return res.status(200).json({
        status: 'success',
        message: 'Photo marked as viewed (placeholder)',
      });
    } catch (error) {
      next(error);
    }
  }
}
