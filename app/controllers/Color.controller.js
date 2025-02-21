const ColorModel = require("../models/Color.model");
const ColorService = require("../services/Color.service");
const {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
} = require("../utils/StatusCode.util");

class ColorController {
  /**
   * Create a new Color
   */
  async create(req, res) {
    try {
      const result = await ColorService.create(req);
      res.status(OK).json(result);
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  }

  /**
   * Get all Colors
   */
  async getAll(req, res) {
    try {
      const result = await ColorService.getAll();
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
