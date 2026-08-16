import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["customer", "provider"],
      required: true
    },

    phone: {
      type: String,
      default: ""
    },

    cnic: {
      type: String,
      default: ""
    },

    city: {
      type: String,
      default: ""
    },

    cnicFileName: {
      type: String,
      default: ""
    },

    cnicDocumentDataUrl: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);

export default PendingUser;
