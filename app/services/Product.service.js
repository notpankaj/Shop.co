const ProductModel = require("../models/Product.model");

class ProductService {
  /**
   * Create a new Product
   */
  static async create(data) {
    const {
      name,
      description,
      brand,
      intendedFor,
      category,
      dressType,
      dressStyle,
    } = data.body;

    const newProduct = new ProductModel({
      name,
      description,
      intendedFor,
      category,
      dressStyle,
      dressType,
      brand,
      user: data.userId,
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
    const list = await ProductModel.find({})
      .populate("category")
      .populate("dressStyle")
      .populate("dressType")
      .populate({ path: "user", populate: { path: "profile" } })
      .populate({
        path: "variants",
        populate: [
          { path: "color.primary", model: "Color" },
          { path: "size", model: "Size" },
        ],
      });
    return {
      success: true,
      message: "Products fetched successfully",
      data: list,
    };
  }
}

module.exports = ProductService;
