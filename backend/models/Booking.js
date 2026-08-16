// import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema({
//   customerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'User'
//   },
//   serviceId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'Service'
//   },
//   providerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'User'
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
//     default: 'pending'
//   },
//   bookingDate: {
//     type: Date,
//     required: true,
//     default: Date.now
//   },
//   completionDate: {
//     type: Date
//   },
//   totalAmount: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   notes: {
//     type: String,
//     default: ''
//   },
//   location: {
//     address: {
//       type: String,
//       default: 'Customer location'
//     },
//     coordinates: {
//       lat: { type: Number, default: 0 },
//       lng: { type: Number, default: 0 }
//     }
//   },
//   emergencyContact: {
//     type: String
//   },
//   providerConfirmed: {
//     type: Boolean,
//     default: false
//   },
//   customerConfirmed: {
//     type: Boolean,
//     default: false
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'held', 'released', 'refunded'],
//     default: 'pending'
//   },
//   releasedAt:               { type: Date },
//   stripeSessionId:          { type: String },
//   stripePaymentIntentId:    { type: String },
//   paidAt:                   { type: Date },
//   adminCommissionRate: {
//     type: Number,
//     default: 0.08
//   },
//   adminCommission: {
//     type: Number,
//     default: 0
//   },
//   providerPayout: {
//     type: Number,
//     default: 0
//   }
// }, {
//   timestamps: true
// });

// bookingSchema.pre('save', function (next) {
//   if (this.isModified('totalAmount') && this.totalAmount > 0) {
//     this.adminCommission = Math.round(this.totalAmount * this.adminCommissionRate * 100) / 100;
//     this.providerPayout  = Math.round((this.totalAmount - this.adminCommission) * 100) / 100;
//   }
//   next();
// });

// const Booking = mongoose.model("Booking", bookingSchema);

// export default Booking;


import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Service'
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  bookingDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  completionDate: {
    type: Date
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    default: ''
  },
  location: {
    address: {
      type: String,
      default: 'Customer location'
    },
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 }
    }
  },
  emergencyContact: {
    type: String
  },
  providerConfirmed: {
    type: Boolean,
    default: false
  },
  customerConfirmed: {
    type: Boolean,
    default: false
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'held', 'released', 'refunded'],
    default: 'pending'
  },
  releasedAt:               { type: Date },
  stripeSessionId:          { type: String },
  stripePaymentIntentId:    { type: String },
  paidAt:                   { type: Date },
  adminCommissionRate: {
    type: Number,
    default: 0.08
  },
  adminCommission: {
    type: Number,
    default: 0
  },
  providerPayout: {
    type: Number,
    default: 0
  },
  reviewed: {
    type: Boolean,
    default: false
  },
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String
    },
    createdAt: {
      type: Date
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    }
  }
}, {
  timestamps: true
});

// REMOVED pre-save hook — route already calculates these values
// If you need the hook, don't pass adminCommission/providerPayout in create()

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;