const Address = require("../models/address.model");

class AddressService {
    /**
     * Add new address (max 3 per user)
     */
    static async addAddress({ user, body }) {
        const userId = user._id;

        const count = await Address.countDocuments({
            user: userId,
            isDeleted: false,
        });

        if (count >= 3) {
            throw new Error("You can only add up to 3 addresses.");
        }

        let {
            name,
            phone,
            alternatePhone,
            pincode,
            locality,
            address,
            landmark,
            city,
            state,
            addressType,
            coordinates, // [longitude, latitude]
        } = body;


        if (!coordinates) {
            coordinates = [0.00, 0.00]
        }
        const newAddress = await Address.create({
            user: userId,
            name,
            phone,
            alternatePhone,
            pincode,
            locality,
            address,
            landmark,
            city,
            state,
            addressType,
            location: {
                type: "Point",
                coordinates,
            },
        });

        return {
            success: true,
            message: "Address added successfully",
            data: newAddress,
        };
    }

    /**
     * Edit existing address
     */
    static async editAddress({ addressId, user, body }) {
        const updatedAddress = await Address.findOneAndUpdate(
            { _id: addressId, user: user._id, isDeleted: false },
            body,
            { new: true, runValidators: true }
        );

        if (!updatedAddress) {
            throw new Error("Address not found or already deleted.");
        }

        return {
            success: true,
            message: "Address updated successfully",
            data: updatedAddress,
        };
    }

    /**
     * Soft delete an address
     */
    static async deleteAddress({ addressId, user }) {
        const deleted = await Address.findOneAndUpdate(
            { _id: addressId, user: user._id },
            { isDeleted: true },
            { new: true }
        );

        if (!deleted) {
            throw new Error("Address not found.");
        }

        return {
            success: true,
            message: "Address deleted successfully",
        };
    }

    /**
     * Get all active addresses of a user
     */
    static async getAddresses({ user }) {
        const addresses = await Address.find({
            user: user._id,
            isDeleted: false,
        });

        return {
            success: true,
            message: "Addresses fetched successfully",
            data: addresses,
        };
    }
}

module.exports = AddressService;
