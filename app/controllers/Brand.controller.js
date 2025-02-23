const BrandService = require("../services/Brand.service");

const {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
} = require("../utils/StatusCode.util");

class ColorController {
  /**
   * Create a new Brand
   */
  async create(req, res) {
    try {
      const result = await BrandService.create(req);
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get all Brand
   */
  async getAll(req, res) {
    try {
      const result = await BrandService.getAll();
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ColorController();
