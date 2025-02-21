const {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
} = require("../utils/StatusCode.util");

const CategoryService = require("../services/Category.service");

class CategoryController {
  /**
   * Create a new Category
   */
  async create(req, res) {
    try {
      const result = await CategoryService.create(req);
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get all Categories
   */
  async getAll(req, res) {
    try {
      const result = await CategoryService.getAll();
      res.status(OK).json(result);
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  }
}

module.exports = new CategoryController();
