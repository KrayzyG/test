import { Router } from 'express';
import { MomentController } from '../controllers/moment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateMomentCreation } from '../middlewares/validation.middleware';

const router = Router();

// Instantiate the controller
const momentController = new MomentController();

// Define the POST endpoint for creating moments
router.post(
  '/', // Assuming the '/api/v1/moments' prefix is handled in app.ts or index.ts
  authMiddleware,
  validateMomentCreation,
  momentController.createMomentPlaceholder
);

export { router as momentRouter };
