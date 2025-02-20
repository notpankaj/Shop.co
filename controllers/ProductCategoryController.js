const ProductCategory = require("../models/productCategoryModel");
const { OK, INTERNAL_SERVER_ERROR } = require("../utils/statusCode");

class ProductCategoryController {
  async create(req, res) {
    try {
      const { name, isActive } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ message: "Name is required" });
      }

      const newProductCategory = new ProductCategory({
        name,
        isActive,
      });

      await newProductCategory.save();
      // response
      res.status(OK).json({
        success: true,
        message: "Product Category Created!",
        data: newProductCategory,
      });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  }

  async getAll(req, res) {
    try {
      const categories = await ProductCategory.find({});
      // response
      res.status(OK).json({
        success: true,
        message: "Product Category get Successfully!",
        data: categories,
      });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  }
}

module.exports = new ProductCategoryController();
