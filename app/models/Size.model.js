const mongoose = require("mongoose");
const SizeSchema = new mongoose.Schema(
    {
        name: {
            type: String, trim: true,
            required: true,
        },
        isActive: {
            type: Boolean,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Size", SizeSchema);
