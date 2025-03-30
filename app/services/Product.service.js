const { default: mongoose } = require("mongoose");
const ProductModel = require("../models/Product.model");
const ProductVariant = require("../models/Variant.model");

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
  // static async getAll(req) {
  //   const { size } = req.query;

  //   // First find all product variants that have the specified size
  //   const matchingVariants = size
  //     ? await ProductVariant.find({
  //         size: new mongoose.Types.ObjectId(size),
  //       }).distinct("_id")
  //     : null;

  //   // Build the product query
  //   let productQuery = ProductModel.find()
  //     .populate("category")
  //     .populate("dressStyle")
  //     .populate("dressType")
  //     .populate({ path: "user", populate: { path: "profile" } })
  //     .populate({
  //       path: "variants",
  //       populate: [
  //         { path: "color.primary", model: "Color" },
  //         { path: "size", model: "Size" },
  //       ],
  //     });

  //   // Add size filter if needed
  //   if (matchingVariants) {
  //     productQuery = productQuery.where({
  //       variants: { $in: matchingVariants },
  //     });
  //   }

  //   const products = await productQuery.exec();

  //   // Filter variants if size filter was applied
  //   const result = size
  //     ? products.map((p) => ({
  //         ...p.toObject(),
  //         variants: p.variants.filter((v) =>
  //           v.size.some((s) => s._id.equals(size))
  //         ),
  //       }))
  //     : products;

  //   return {
  //     success: true,
  //     message: "Products fetched successfully",
  //     data: result,
  //   };
  // }
  static async getAll(req) {
    const { size } = req.query;

    // First find all product variants that have the specified size
    const matchingVariants = size
      ? await ProductVariant.find({
          size: new mongoose.Types.ObjectId(size),
        }).distinct("_id")
      : null;

    // Build the product query
    let productQuery = ProductModel.find()
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

    // Add size filter if needed
    if (matchingVariants) {
      productQuery = productQuery.where({
        variants: { $in: matchingVariants },
      });
    }

    const products = await productQuery.exec();

    // Filter variants if size filter was applied
    const result = size
      ? products.map((p) => ({
          ...p.toObject(),
          variants: p.variants.filter((v) =>
            v.size.some((s) => s._id.equals(size))
          ),
        }))
      : products;

    return {
      success: true,
      message: "Products fetched successfully",
      data: result,
    };
  }
  /**
   * Get Product By ID
   */
  static async getProductById(data) {
    const { id } = data.params;
    const list = await ProductModel.findById(id)
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
