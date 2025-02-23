const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    intendedFor: {
      type: String,
      enum: ["male", "female", "baby", "unisex"],
      default: "unisex",
    },
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductVariant",
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    dressStyle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DressStyle",
    },
    dressType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DressType",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
