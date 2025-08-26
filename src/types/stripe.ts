

export interface CheckoutSessionParams {
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}
