const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, trim: true, required: [true, "Please add a firstName"] },
        lastName: { type: String, trim: true, required: [true, "Please add a lastName"] },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            default: "other",
        },
        phone: { type: String, trim: true },
        email: {
            type: String,
            trim: true,
            unique: [true, "Email already registered."],
        },
        password: {
            type: String,
            required: [false, "Please add password"],
        },
    },
    { timestamps: true }
);

userSchema.index({ address: "2dsphere" });

const User = mongoose.model("User", userSchema);

module.exports = User;
