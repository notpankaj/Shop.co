const { default: mongoose } = require("mongoose");
const ProductModel = require("../models/Product.model");
const ProductVariant = require("../models/Variant.model");

class ProductService {
  /**
   * get Single Product
   */
  static async getProductById(data) {
    const productId = data.params.id;

    const product = await ProductModel.findOne({ _id: productId })
      .populate({
        path: "variants",
        populate: [
          { path: "color.primary", model: "Color" },
          { path: "size", model: "Size" },
        ],
      })
      .populate("category")
      .populate("dressStyle");

    return {
      success: true,
      message: "Product Get Successfuly",
      data: product?._doc || product,
    };
  }
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
  static async getAll(req) {
    const {
      size,
      color,
      category,
      dressStyle,
      dressType,
      intendedFor,
      search, // New search parameter
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Validate pagination params
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    if (isNaN(pageNumber) || pageNumber < 1)
      throw new Error("Invalid page number");
    if (isNaN(limitNumber) || limitNumber < 1) throw new Error("Invalid limit");

    // Validate sort params
    const validSortFields = ["createdAt", "name", "price"];
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    if (!validSortFields.includes(sortBy))
      throw new Error("Invalid sort field");

    // First find all product variants that match the variant-level filters (size, color)
    const variantFilters = {};

    if (size) {
      variantFilters.size = new mongoose.Types.ObjectId(size);
    }

    if (color) {
      variantFilters["color.primary"] = new mongoose.Types.ObjectId(color);
    }

    const matchingVariantIds =
      size || color
        ? await ProductVariant.find(variantFilters).distinct("_id")
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
      })
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Add product-level filters
    const productFilters = {};

    if (category) {
      productFilters.category = new mongoose.Types.ObjectId(category);
    }

    if (dressStyle) {
      productFilters.dressStyle = new mongoose.Types.ObjectId(dressStyle);
    }

    if (dressType) {
      productFilters.dressType = new mongoose.Types.ObjectId(dressType);
    }

    if (intendedFor) {
      productFilters.intendedFor = intendedFor;
    }

    // Add search by product name (case-insensitive)
    if (search) {
      productFilters.name = {
        $regex: search,
        $options: "i", // 'i' for case insensitive
      };
    }

    if (Object.keys(productFilters).length > 0) {
      productQuery = productQuery.where(productFilters);
    }

    // Add variant filter if needed
    if (matchingVariantIds) {
      productQuery = productQuery.where({
        variants: { $in: matchingVariantIds },
      });
    }

    // Execute both queries in parallel for better performance
    const [products, totalCount] = await Promise.all([
      productQuery.exec(),
      ProductModel.countDocuments(productFilters),
    ]);

    // Filter variants if variant filters were applied
    const filteredProducts =
      size || color
        ? products.map((p) => ({
          ...p.toObject(),
          variants: p.variants.filter((v) => {
            const sizeMatch = size
              ? v.size.some((s) => s._id.equals(size))
              : true;
            const colorMatch = color
              ? v.color.primary._id.equals(color)
              : true;
            return sizeMatch && colorMatch;
          }),
        }))
        : products;

    return {
      success: true,
      message: "Products fetched successfully",
      data: {
        products: filteredProducts,
        pagination: {
          total: totalCount,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(totalCount / limitNumber),
          hasNextPage: pageNumber * limitNumber < totalCount,
          hasPrevPage: pageNumber > 1,
        },
      },
    };
  }

  static async getAllNew(req) {
    const {
      size,
      color,
      category,
      dressStyle,
      intendedFor,
      search,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      maxPrice,
    } = req.query;

    const pipeline = [];

    // 1. Product-level filters
    const productMatch = {};
    if (category) productMatch.category = new mongoose.Types.ObjectId(category);
    if (dressStyle)
      productMatch.dressStyle = new mongoose.Types.ObjectId(dressStyle);
    if (intendedFor) productMatch.intendedFor = intendedFor;
    if (search) productMatch.name = { $regex: search, $options: "i" };

    if (Object.keys(productMatch).length > 0) {
      pipeline.push({ $match: productMatch });
    }

    // 2. Lookup variants
    pipeline.push({
      $lookup: {
        from: "productvariants",
        localField: "variants",
        foreignField: "_id",
        as: "variants",
      },
    });

    // 3. Unwind variants
    pipeline.push({ $unwind: "$variants" });

    // 4. Variant-level filters
    const variantMatch = {};
    if (size) {
      variantMatch["variants.size"] = {
        $in: [new mongoose.Types.ObjectId(size)],
      };
    }
    if (color) {
      variantMatch["variants.color.primary"] = new mongoose.Types.ObjectId(
        color
      );
    }
    if (maxPrice > 4) {
      variantMatch["variants.price"] = { $lte: parseFloat(maxPrice) };
    }

    if (Object.keys(variantMatch).length > 0) {
      pipeline.push({ $match: variantMatch });
    }

    // // 5. Regroup variants under products (if needed)
    // pipeline.push({
    //   $group: {
    //     _id: "$_id",
    //     name: { $first: "$name" },
    //     description: { $first: "$description" },
    //     intendedFor: { $first: "$intendedFor" },
    //     category: { $first: "$category" },
    //     dressStyle: { $first: "$dressStyle" },
    //     dressType: { $first: "$dressType" },
    //     createdAt: { $first: "$createdAt" },
    //     variants: { $push: "$variants" },
    //   },
    // });

    // 6. Sorting
    pipeline.push({
      $sort: {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      },
    });

    // 7. Pagination
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: parseInt(limit) });

    const results = await ProductModel.aggregate(pipeline);

    return {
      success: true,
      message: "Products fetched successfully",
      data: results,
    };
  }
}

module.exports = ProductService;
