
import { z } from 'zod';

export const createPaymentSchema = z.object({
  courseId: z.string()
    .min(1, 'Course ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID format'),
  successUrl: z.string().url('Invalid success URL').optional(),
  cancelUrl: z.string().url('Invalid cancel URL').optional(),
});

export const refundRequestSchema = z.object({
  reason: z.enum([
    'duplicate',
    'fraudulent',
    'requested_by_customer',
    'product_not_received',
    'product_unacceptable',
    'other'
  ]).optional(),
  description: z.string().max(500, 'Description too long').optional(),
});

export const webhookEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.record(z.string(),z.unknown()),
  }),
});

export const subscriptionCreateSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  successUrl: z.string().url('Invalid success URL').optional(),
  cancelUrl: z.string().url('Invalid cancel URL').optional(),
  trialDays: z.number().min(0).max(365).optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type RefundRequestInput = z.infer<typeof refundRequestSchema>;
export type WebhookEventInput = z.infer<typeof webhookEventSchema>;
export type SubscriptionCreateInput = z.infer<typeof subscriptionCreateSchema>;