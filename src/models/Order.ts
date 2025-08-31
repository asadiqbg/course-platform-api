// src/models/Order.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  course?: mongoose.Types.ObjectId;
  _id: mongoose.Types.ObjectId,
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentMethod: string;
  stripeSessionId?: string;
  paymentIntentId?: string;
  invoiceId?: string;
  subscriptionId?: string;
  refundId?: string;
  refundAmount?: number;
  refundReason?: string;
  failureReason?: string;
  completedAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'usd',
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'stripe',
    },
    stripeSessionId: {
      type: String,
      sparse: true,
      index: true,
    },
    paymentIntentId: {
      type: String,
      sparse: true,
      index: true,
    },
    invoiceId: {
      type: String,
      sparse: true,
    },
    subscriptionId: {
      type: String,
      sparse: true,
    },
    refundId: {
      type: String,
      sparse: true,
    },
    refundAmount: {
      type: Number,
      min: 0,
    },
    refundReason: {
      type: String,
      maxlength: 500,
    },
    failureReason: {
      type: String,
      maxlength: 500,
    },
    completedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    refundedAt: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
OrderSchema.index({ user: 1, status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ user: 1, course: 1 });

// Virtual for order number
OrderSchema.virtual('orderNumber').get(function(this:IOrder) {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Methods
OrderSchema.methods.canRefund = function(): boolean {
  if (this.status !== 'completed') return false;
  if (!this.completedAt) return false;
  
  // Check if within refund period (30 days)
  const daysSincePurchase = Math.floor(
    (Date.now() - this.completedAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return daysSincePurchase <= 30;
};

OrderSchema.methods.markAsCompleted = async function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return await this.save();
};

OrderSchema.methods.markAsFailed = async function(reason?: string) {
  this.status = 'failed';
  this.failureReason = reason;
  return await this.save();
};

// Statics
OrderSchema.statics.findBySessionId = function(sessionId: string) {
  return this.findOne({ stripeSessionId: sessionId });
};

OrderSchema.statics.findByPaymentIntent = function(paymentIntentId: string) {
  return this.findOne({ paymentIntentId });
};

OrderSchema.statics.getUserOrders = function(userId: string, status?: string) {
  const query: any = { user: userId };
  if (status) query.status = status;
  return this.find(query).sort({ createdAt: -1 });
};

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;