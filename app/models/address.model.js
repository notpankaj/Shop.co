const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            match: [/^\d{10}$/, "Phone number must be 10 digits"],
        },

        alternatePhone: {
            type: String,
            match: [/^\d{10}$/, "Alternate phone must be 10 digits"],
        },

        pincode: {
            type: String,
            required: true,
            match: [/^\d{6}$/, "Pincode must be 6 digits"],
        },

        locality: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        landmark: {
            type: String,
            trim: true,
        },

        city: {
            type: String,
            required: true,
            trim: true,
        },

        state: {
            type: String,
            required: true,
            trim: true,
        },

        addressType: {
            type: String,
            enum: ["home", "work"],
            default: "home",
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: false,
            },
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

addressSchema.index({ location: "2dsphere" });

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
