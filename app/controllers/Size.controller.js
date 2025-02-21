const SizeService = require("../services/Size.service");
const { OK, BAD_REQUEST } = require("../utils/StatusCode.util");

class SizeController {
  /**
   * Create a new Size
   */
  async create(req, res) {
    try {
      const result = await SizeService.create(req);
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
  /**
   * Get all Sizes
   */
  async getAll(req, res) {
    try {
      const result = await SizeService.getAll();
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new SizeController();
