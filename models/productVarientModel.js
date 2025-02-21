const mongoose = require("mongoose");
const ProductVariantSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    color: {
      primary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color",
        required: true,
      },
      secondary: {
        type: String,
        required: true,
      },
    },
    size:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Size",
    },
    photos: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductVariant", ProductVariantSchema);
