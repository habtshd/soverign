export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  ORGANIZER: 'ORGANIZER',
  MENTOR: 'MENTOR',
  MEMBER: 'MEMBER',
  VOLUNTEER: 'VOLUNTEER',
  FINANCE_MANAGER: 'FINANCE_MANAGER',
  CONTENT_MANAGER: 'CONTENT_MANAGER',
} as const;

export type RoleName = keyof typeof ROLES;

export const PERMISSIONS = {
  // Members
  MEMBERS_READ: 'members:read',
  MEMBERS_WRITE: 'members:write',
  MEMBERS_VERIFY: 'members:verify',
  APPLICATIONS_REVIEW: 'applications:review',

  // Events
  EVENTS_READ: 'events:read',
  EVENTS_WRITE: 'events:write',
  ATTENDANCE_MANAGE: 'attendance:manage',

  // Learning
  COURSES_READ: 'courses:read',
  COURSES_WRITE: 'courses:write',

  // Mentorship
  MENTORSHIP_READ: 'mentorship:read',
  MENTORSHIP_MANAGE: 'mentorship:manage',

  // Fitness
  FITNESS_READ: 'fitness:read',
  FITNESS_MANAGE: 'fitness:manage',

  // Business & Career
  BUSINESS_READ: 'business:read',
  CAREER_READ: 'career:read',
  JOBS_POST: 'jobs:post',

  // Community Service
  SERVICE_READ: 'service:read',
  SERVICE_MANAGE: 'service:manage',

  // Finance
  FINANCE_READ: 'finance:read',
  FINANCE_WRITE: 'finance:write',
  PAYMENTS_MANAGE: 'payments:manage',

  // Integrations & Admin
  INTEGRATIONS_MANAGE: 'integrations:manage',
  AUDIT_READ: 'audit:read',
  SETTINGS_MANAGE: 'settings:manage',
} as const;
