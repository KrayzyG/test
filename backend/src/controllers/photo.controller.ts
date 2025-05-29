import { Request, Response, NextFunction } from 'express';
import { PhotoService } from '../services/photo.service';
import { NotificationService } from '../services/notification.service';
import { AuthRequest } from '../types/express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { firebaseStorage } from '../config/firebase.config';

const photoService = new PhotoService();
const notificationService = new NotificationService();

// Configure multer for file uploads
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
   * Upload and send a new photo
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
        
        const { caption, recipients } = req.body;
        
        if (!req.file) {
          return res.status(400).json({
            status: 'error',
            code: 400,
            message: 'Image file is required',
          });
        }
        
        if (!recipients || !Array.isArray(JSON.parse(recipients)) || JSON.parse(recipients).length === 0) {
          return res.status(400).json({
            status: 'error',
            code: 400,
            message: 'At least one recipient is required',
          });
        }
        
        const recipientIds = JSON.parse(recipients).map((id: string) => parseInt(id));
        
        // Upload file to Firebase Storage
        const bucket = firebaseStorage.bucket();
        const filename = `photos/${userId}/${uuidv4()}-${Date.now()}${path.extname(req.file.originalname)}`;
        const file = bucket.file(filename);
        
        const stream = file.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
        });
        
        stream.on('error', (error) => {
          console.error('Error uploading to Firebase Storage:', error);
          return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Error uploading image',
          });
        });
        
        stream.on('finish', async () => {
          try {
            // Make the file publicly accessible
            await file.makePublic();
            
            // Get public URL
            const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
            
            // Create photo record
            const photo = await photoService.createPhoto({
              sender_id: userId,
              image_url: imageUrl,
              caption: caption || null,
              recipients: recipientIds,
            });
            
            // Create notifications for recipients
            for (const recipientId of recipientIds) {
              await notificationService.createNotification({
                user_id: recipientId,
                type: 'photo',
                reference_id: photo.id,
                content: `${req.user?.username} sent you a photo`,
              });
            }
            
            return res.status(201).json({
              status: 'success',
              data: {
                photo: {
                  id: photo.id,
                  image_url: photo.image_url,
                  caption: photo.caption,
                  created_at: photo.created_at,
                  recipients: photo.recipients.map(recipient => ({
                    id: recipient.id,
                    user_id: recipient.recipient_id,
                  })),
                },
              },
            });
          } catch (error) {
            next(error);
          }
        });
        
        // Write the file buffer to the stream
        stream.end(req.file.buffer);
      } catch (error) {
        next(error);
      }
    });
  }
  
  /**
   * Get sent photos history
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
      
      const photos = await photoService.getSentPhotos(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
      );
      
      return res.status(200).json({
        status: 'success',
        data: {
          photos: photos.rows.map(photo => ({
            id: photo.id,
            image_url: photo.image_url,
            caption: photo.caption,
            created_at: photo.created_at,
            recipients: photo.recipients.map(recipient => ({
              id: recipient.id,
              user_id: recipient.recipient_id,
              viewed_at: recipient.viewed_at,
            })),
          })),
          pagination: {
            total: photos.count,
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            pages: Math.ceil(photos.count / parseInt(limit as string)),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get received photos
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
      
      const photos = await photoService.getReceivedPhotos(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
      );
      
      return res.status(200).json({
        status: 'success',
        data: {
          photos: photos.rows.map(recipient => ({
            id: recipient.photo.id,
            image_url: recipient.photo.image_url,
            caption: recipient.photo.caption,
            created_at: recipient.photo.created_at,
            sender: {
              id: recipient.photo.sender.id,
              username: recipient.photo.sender.username,
              profile_image: recipient.photo.sender.profile_image,
            },
            viewed_at: recipient.viewed_at,
          })),
          pagination: {
            total: photos.count,
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            pages: Math.ceil(photos.count / parseInt(limit as string)),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get latest photo for widget
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
      
      const photo = await photoService.getLatestReceivedPhoto(userId);
      
      if (!photo) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'No photos found',
        });
      }
      
      // Mark as viewed if not already
      if (!photo.viewed_at) {
        await photoService.markPhotoAsViewed(photo.id);
      }
      
      return res.status(200).json({
        status: 'success',
        data: {
          photo: {
            id: photo.photo.id,
            image_url: photo.photo.image_url,
            caption: photo.photo.caption,
            created_at: photo.photo.created_at,
            sender: {
              id: photo.photo.sender.id,
              username: photo.photo.sender.username,
              profile_image: photo.photo.sender.profile_image,
            },
            viewed_at: photo.viewed_at,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete a photo
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
      
      if (!id) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Photo ID is required',
        });
      }
      
      const photo = await photoService.getPhotoById(parseInt(id));
      
      if (!photo) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Photo not found',
        });
      }
      
      // Check if user is the sender
      if (photo.sender_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to delete this photo',
        });
      }
      
      await photoService.deletePhoto(parseInt(id));
      
      return res.status(200).json({
        status: 'success',
        message: 'Photo deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Mark photo as viewed
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
      
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Photo recipient ID is required',
        });
      }
      
      const recipient = await photoService.getPhotoRecipientById(parseInt(id));
      
      if (!recipient) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Photo recipient not found',
        });
      }
      
      // Check if user is the recipient
      if (recipient.recipient_id !== userId) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Not authorized to mark this photo as viewed',
        });
      }
      
      await photoService.markPhotoAsViewed(parseInt(id));
      
      return res.status(200).json({
        status: 'success',
        message: 'Photo marked as viewed',
      });
    } catch (error) {
      next(error);
    }
  }
}
