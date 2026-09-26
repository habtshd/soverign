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
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  occupation: z.string().optional(),
  city: z.string().optional(),
  reasonToJoin: z.string().min(10),
  membershipTypeCode: z.string().default('GENERAL'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8),
});
