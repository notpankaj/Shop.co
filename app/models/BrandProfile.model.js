const mongoose = require("mongoose");

const brandProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: [true, "User reference is required"],
    },
    brandName: {
      type: String,
      trim: true,
      required: [true, "Please add a brand name"],
    },
    phone: { type: String, trim: true },
    poster: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const BrandProfile = mongoose.model("BrandProfile", brandProfileSchema);

module.exports = BrandProfile;
