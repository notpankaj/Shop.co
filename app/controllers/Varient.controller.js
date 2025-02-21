// Utils
const { OK, BAD_REQUEST } = require("../utils/StatusCode.util");

const VariantService = require("../services/Variant.service");

class ProductVarientController {
  /**
   *  Create New Varient
   */
  async create(req, res) {
    try {
      const result = await VariantService.create(req);
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ProductVarientController();
