import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Booking'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  adminCommission: {
    type: Number,
    default: 0,
    min: 0
  },
  providerAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  commissionPercentage: {
    type: Number,
    default: 0.08
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partial_refund'],
    default: 'pending'
  },
  providerPaymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  stripeSessionId:          { type: String },
  stripePaymentIntentId:    { type: String },
  customerStripeChargeId:   { type: String },
  providerStripeTransferId: { type: String },
  paidAt:         { type: Date },
  providerPaidAt: { type: Date },
  refundedAt:     { type: Date },
  refundAmount:   { type: Number, default: 0 },
  refundReason:   { type: String },
  serviceCompleted:    { type: Boolean, default: false },
  completedAt:         { type: Date },
  confirmedByProvider: { type: Boolean, default: false },
  confirmedByCustomer: { type: Boolean, default: false },
  notes: { type: String }
}, {
  timestamps: true
});

paymentSchema.pre('save', function (next) {
  if (this.isModified('totalAmount') && this.totalAmount > 0) {
    this.adminCommission = Math.round(this.totalAmount * this.commissionPercentage * 100) / 100;
    this.providerAmount  = Math.round((this.totalAmount - this.adminCommission) * 100) / 100;
  }
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;




