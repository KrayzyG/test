import { Router } from 'express';
import { FriendController } from '../controllers/friend.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  friendRequestValidation,
  idParamValidation,
  validate
} from '../middlewares/validation.middleware';

const router = Router();
const friendController = new FriendController();

// All routes require authentication
router.use(authMiddleware);

// Get friends list
router.get('/', (req, res, next) => 
  friendController.getFriends(req, res, next)
);

// Send friend request
router.post('/request', friendRequestValidation, validate, (req, res, next) => 
  friendController.sendFriendRequest(req, res, next)
);

// Get friend requests
router.get('/requests', (req, res, next) => 
  friendController.getFriendRequests(req, res, next)
);

// Accept friend request
router.put('/:id/accept', idParamValidation, validate, (req, res, next) => 
  friendController.acceptFriendRequest(req, res, next)
);

// Reject friend request
router.put('/:id/reject', idParamValidation, validate, (req, res, next) => 
  friendController.rejectFriendRequest(req, res, next)
);

// Remove friend
router.delete('/:id', idParamValidation, validate, (req, res, next) => 
  friendController.removeFriend(req, res, next)
);

export default router;
