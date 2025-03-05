const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: [true, "Email already registered."],
    },
    password: {
      type: String,
      required: [false, "Please add password"],
    },
    role: {
      type: String,
      enum: ["customer", "brand"],
      required: [true, "Please specify a role"],
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "roleModel",
    },
    roleModel: {
      type: String,
      enum: ["CustomerProfile", "BrandProfile"], // Must match your model names
      required: [true, "Role model must be specified"],
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ address: "2dsphere" });

const User = mongoose.model("User", userSchema);

module.exports = User;


