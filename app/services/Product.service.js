const ProductModel = require("../models/Product.model");

class ProductService {
  /**
   * Create a new Product
   */
  static async create(data) {
    const { name, description, intendedFor, category, dressType, dressStyle } =
      data.body;

    const newProduct = new ProductModel({
      name,
      description,
      intendedFor,
      category,
      dressStyle,
      dressType,
    });

    await newProduct.save();

    return {
      success: true,
      message: "Product Create Successfuly",
      data: newProduct,
    };
  }

  /**
   * Get all Products
   */
  static async getAll() {
    const list = await ProductModel.find({});
    return {
      success: true,
      message: "Products fetched successfully",
      data: list,
    };
  }
}

module.exports = ProductService;
