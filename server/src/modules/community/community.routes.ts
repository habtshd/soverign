import { Router } from 'express';
import { CommunityController } from './community.controller.js';
import { authenticateToken } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

const router = Router();

router.use(authenticateToken);

router.get('/announcements', CommunityController.getAnnouncements);
router.post('/announcements', requireRole('SUPER_ADMIN', 'ADMIN', 'ORGANIZER'), CommunityController.createAnnouncement);

router.get('/posts', CommunityController.getPosts);
router.post('/posts', CommunityController.createPost);
router.post('/posts/:id/like', CommunityController.toggleLike);
router.post('/posts/:id/comments', CommunityController.addComment);

export default router;
