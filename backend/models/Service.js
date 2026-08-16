import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    group: {
      type: String,
      default: 'home'
    },

    
    location: {
      type: String,
      required: true
    },

    images: [{
      type: String
    }],

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },

    status: {
      type: String,
      enum: ['pending_approval', 'approved', 'rejected', 'active', 'inactive', 'draft'],
      default: 'pending_approval'
    },

    isApproved: {
      type: Boolean,
      default: false
    },

    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },

    rejectionReason: {
      type: String
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    approvedAt: {
      type: Date
    },

    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    rejectedAt: {
      type: Date
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    eta: {
      type: String,
      required: true
    },

    duration: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    reviews: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],

    bookings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }],

    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
