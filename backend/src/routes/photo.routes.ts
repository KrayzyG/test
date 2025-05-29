import { Router } from 'express';
import { PhotoController } from '../controllers/photo.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  uploadPhotoValidation,
  idParamValidation,
  validate
} from '../middlewares/validation.middleware';

const router = Router();
const photoController = new PhotoController();

// All routes require authentication
router.use(authMiddleware);

// Upload and send a new photo
router.post('/', uploadPhotoValidation, validate, (req, res, next) => 
  photoController.uploadPhoto(req, res, next)
);

// Get sent photos history
router.get('/', (req, res, next) => 
  photoController.getSentPhotos(req, res, next)
);

// Get received photos
router.get('/received', (req, res, next) => 
  photoController.getReceivedPhotos(req, res, next)
);

// Get latest photo for widget
router.get('/latest', (req, res, next) => 
  photoController.getLatestPhoto(req, res, next)
);

// Delete a photo
router.delete('/:id', idParamValidation, validate, (req, res, next) => 
  photoController.deletePhoto(req, res, next)
);

// Mark photo as viewed
router.put('/recipient/:id/view', idParamValidation, validate, (req, res, next) => 
  photoController.markPhotoAsViewed(req, res, next)
);

export default router;
