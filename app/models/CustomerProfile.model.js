const mongoose = require("mongoose");

const customerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: [true, "User reference is required"],
    },
    firstName: {
      type: String,
      trim: true,
      required: [true, "Please add a firstName"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Please add a lastName"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "unknown"],
      default: "unknown",
    },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
);


const CustomerProfile = mongoose.model("CustomerProfile", customerProfileSchema);

module.exports = CustomerProfile;