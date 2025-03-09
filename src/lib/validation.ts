import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  email: z.string().email().optional(),
  name: z.string().min(2).optional(),
  role: z.enum(['user', 'admin']).default('user'),
  created_at: z.string().datetime().optional()
});

export const bookingSchema = z.object({
  user_id: z.string().uuid(),
  test_id: z.string().uuid(),
  lab_id: z.string().uuid(),
  booking_date: z.string().datetime(),
  booking_time: z.string(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).default('pending'),
  amount: z.number().positive(),
  home_collection: z.boolean().default(false),
  address: z.string().optional(),
  created_at: z.string().datetime().optional()
});

export const paymentSchema = z.object({
  booking_id: z.string().uuid(),
  amount: z.number().positive(),
  status: z.enum(['pending', 'completed', 'failed']).default('pending'),
  payment_method: z.string().optional(),
  transaction_id: z.string().optional(),
  created_at: z.string().datetime().optional()
});

export const testResultSchema = z.object({
  booking_id: z.string().uuid(),
  result_data: z.record(z.unknown()),
  status: z.enum(['pending', 'completed', 'failed']).default('pending'),
  report_url: z.string().url().optional(),
  created_at: z.string().datetime().optional()
});