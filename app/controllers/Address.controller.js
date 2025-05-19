const { OK, BAD_REQUEST, NOT_FOUND } = require("../utils/StatusCode.util");
const AddressService = require("../services/Address.service");

class AddressController {
    /**
     * Add new address (Max 5 per user)
     */
    async addAddress(req, res) {
        try {
            const data = {
                body: req.body,
                user: req.user, // user should be added by auth middleware
            };

            const result = await AddressService.addAddress(data);
            res.status(OK).json(result);
        } catch (error) {
            res.status(BAD_REQUEST).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Edit existing address
     */
    async editAddress(req, res) {
        try {
            const data = {
                addressId: req.params.addressId,
                body: req.body,
                user: req.user,
            };

            const result = await AddressService.editAddress(data);
            res.status(OK).json(result);
        } catch (error) {
            res.status(BAD_REQUEST).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Delete (soft) address
     */
    async deleteAddress(req, res) {
        try {
            const data = {
                addressId: req.params.addressId,
                user: req.user,
            };

            const result = await AddressService.deleteAddress(data);
            res.status(OK).json(result);
        } catch (error) {
            res.status(NOT_FOUND).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get all active addresses
     */
    async getAddresses(req, res) {
        try {
            const data = { user: req.user };

            const result = await AddressService.getAddresses(data);
            res.status(OK).json(result);
        } catch (error) {
            res.status(BAD_REQUEST).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new AddressController();
