const ProductService = require("../services/Product.service");
const { OK, BAD_REQUEST } = require("../utils/StatusCode.util");

class ProductController {
  /**
   * Create a New Product
   */

  async create(req, res) {
    try {
      const result = await ProductService.create(req);
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
  /**
   * Get all  Products
   */
  async getAll(req, res) {
    try {
      const result = await ProductService.getAll();
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ProductController();
