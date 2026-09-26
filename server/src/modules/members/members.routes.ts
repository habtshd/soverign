import { Router } from 'express';
import { MembersController } from './members.controller.js';
import { authenticateToken } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

const router = Router();

// Public routes
router.get('/digital-id/:code', MembersController.verifyDigitalId);
router.post('/apply', MembersController.submitApplication);
router.get('/types', MembersController.getTypes);

// Authenticated routes
router.use(authenticateToken);

router.get('/', requireRole('SUPER_ADMIN', 'ADMIN', 'ORGANIZER'), MembersController.getAll);
router.get('/applications', requireRole('SUPER_ADMIN', 'ADMIN'), MembersController.getApplications);
router.patch('/applications/:id/review', requireRole('SUPER_ADMIN', 'ADMIN'), MembersController.reviewApplication);
router.post('/:id/verify', requireRole('SUPER_ADMIN', 'ADMIN'), MembersController.verifyMember);
router.get('/:id', MembersController.getById);
router.patch('/:id/profile', MembersController.updateProfile);

export default router;
