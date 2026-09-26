import { Router } from 'express';
import { EventsController } from './events.controller.js';
import { authenticateToken } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

const router = Router();

router.use(authenticateToken);

router.get('/', EventsController.getAll);
router.get('/categories', EventsController.getCategories);
router.get('/locations', EventsController.getLocations);
router.get('/:id', EventsController.getById);

router.post('/', requireRole('SUPER_ADMIN', 'ADMIN', 'ORGANIZER'), EventsController.create);
router.post('/:id/register', EventsController.register);
router.post('/:id/cancel', EventsController.cancelRegistration);
router.post('/:id/checkin', requireRole('SUPER_ADMIN', 'ADMIN', 'ORGANIZER'), EventsController.checkIn);
router.post('/:id/feedback', EventsController.feedback);

export default router;
