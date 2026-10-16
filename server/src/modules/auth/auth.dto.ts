import { z } from 'zod';

export const loginSchema = z
  .object({
    identifier: z.string().min(1).optional(),
    email: z.string().min(1).optional(),
    password: z.string().min(6),
  })
  .refine((data) => data.identifier || data.email, {
    message: 'Member ID, Digital ID code, or Email is required',
  });

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  occupation: z.string().optional(),
  city: z.string().optional(),
  location: z.string().optional(),
  telegramUsername: z.string().optional(),
  telegramHandle: z.string().optional(),
  reasonToJoin: z.string().optional(),
  source: z.string().optional(),
  membershipTypeCode: z.string().default('GENERAL'),
  responses: z.any().optional(),
  responsesJson: z.any().optional(),
}).passthrough();

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8),
});
