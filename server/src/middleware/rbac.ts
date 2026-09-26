import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const hasSuperAdmin = req.user.roles.includes('SUPER_ADMIN');
    if (hasSuperAdmin) {
      return next();
    }

    const hasAllowedRole = allowedRoles.some((role) => req.user?.roles.includes(role));

    if (!hasAllowedRole) {
      return next(new AppError(`Forbidden: requires one of [${allowedRoles.join(', ')}]`, 403));
    }

    next();
  };
}

export function requirePermission(...requiredPermissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const hasSuperAdmin = req.user.roles.includes('SUPER_ADMIN');
    if (hasSuperAdmin) {
      return next();
    }

    const userPerms = req.user.permissions || [];
    const hasRequired = requiredPermissions.every((perm) => userPerms.includes(perm));

    if (!hasRequired) {
      return next(new AppError('Forbidden: insufficient permissions', 403));
    }

    next();
  };
}
