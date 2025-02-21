const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: [true, "Please add a firstName"] },
        lastName: { type: String, required: [true, "Please add a lastName"] },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            default: "other",
        },
        phone: { type: String },
        email: {
            type: String,
            unique: [true, "Email already registered."],
            trim: true,
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
