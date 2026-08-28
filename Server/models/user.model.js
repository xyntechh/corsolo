const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // User Type
    isGuest: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Identity
    ip: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },

    dob: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "Other"],
      required: true,
    },

    // Login
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    password: {
      type: String,
      default: null,
    },

    // Profile
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dxjv0gq2f/image/upload/v1690911685/Default-Profile-Picture.png",
    },

    bio: {
      type: String,
      maxlength: 300,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "",
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    // Matching
    lookingFor: {
      type: String,
      enum: ["Men", "Women", "Everyone", "Other"],
      default: "Everyone",
    },

    interestsIn: {
      type: [String],
      default: [],
    },

    yourInterests: {
      type: [String],
      default: [],
    },

    // Premium
    isPremium: {
      type: Boolean,
      default: false,
    },

    premiumExpiresAt: {
      type: Date,
      default: null,
    },

    // Verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Password Reset
    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },

    // Presence
    isOnline: {
      type: Boolean,
      default: false,
    },

    socketId: {
      type: String,
      default: null,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    coin: {
      type: Number,
      default: 0,
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },


  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ isOnline: 1 });
userSchema.index({ country: 1, state: 1, city: 1 });

module.exports = mongoose.model("User", userSchema);