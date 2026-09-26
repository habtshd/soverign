import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './modules/auth/auth.routes.js';
import membersRoutes from './modules/members/members.routes.js';
import eventsRoutes from './modules/events/events.routes.js';
import learningRoutes from './modules/learning/learning.routes.js';
import mentorshipRoutes from './modules/mentorship/mentorship.routes.js';
import fitnessRoutes from './modules/fitness/fitness.routes.js';
import businessRoutes from './modules/business/business.routes.js';
import serviceRoutes from './modules/service/service.routes.js';
import communityRoutes from './modules/community/community.routes.js';
import financeRoutes from './modules/finance/finance.routes.js';
import notificationsRoutes from './modules/notifications/notifications.routes.js';
import integrationsRoutes from './modules/integrations/integrations.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

export function createApp() {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'HEALTHY',
      service: "Sovereign Men's Club Platform API",
      timestamp: new Date().toISOString(),
    });
  });

  // API v1 Domain Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/members', membersRoutes);
  app.use('/api/v1/events', eventsRoutes);
  app.use('/api/v1/learning', learningRoutes);
  app.use('/api/v1/mentorship', mentorshipRoutes);
  app.use('/api/v1/fitness', fitnessRoutes);
  app.use('/api/v1/business', businessRoutes);
  app.use('/api/v1/service', serviceRoutes);
  app.use('/api/v1/community', communityRoutes);
  app.use('/api/v1/finance', financeRoutes);
  app.use('/api/v1/notifications', notificationsRoutes);
  app.use('/api/v1/integrations', integrationsRoutes);
  app.use('/api/v1/admin', adminRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
