const Product = require("../models/productModel");
const { OK, INTERNAL_SERVER_ERROR } = require("../utils/statusCode");

class ProductController {
  async create(req, res) {
    try {
      const {
        name,
        description,
        intendedFor,
        category,
        dressType,
        dressStyle,
      } = req.body;

      const newProduct = new Product({
        name,
        description,
        intendedFor,
        category,
        dressStyle,
        dressType,
      });

      // response
      await newProduct.save();

      res
        .status(OK)
        .json({ success: true, message: "Product Create", data: newProduct });
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
      const products = await Product.find({});

      res.status(OK).json({
        success: true,
        message: "Product get Successfully",
        data: products,
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

module.exports = new ProductController();
