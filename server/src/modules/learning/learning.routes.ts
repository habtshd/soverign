import { Router } from 'express';
import { LearningController } from './learning.controller.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/courses', LearningController.getAllCourses);
router.get('/courses/:slug', LearningController.getCourseBySlug);
router.post('/courses/:id/enroll', LearningController.enroll);
router.post('/lessons/:lessonId/toggle', LearningController.toggleLesson);
router.get('/books', LearningController.getBooks);
router.get('/podcasts', LearningController.getPodcasts);

export default router;
