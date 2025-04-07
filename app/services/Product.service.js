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
      dressType,
      intendedFor,
      search,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      maxPrice,
    } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;

    const pipeline = [
      // STAGE 1: Initial Product Filtering
      {
        $match: {
          ...(category && { category: new mongoose.Types.ObjectId(category) }),
          ...(dressStyle && {
            dressStyle: new mongoose.Types.ObjectId(dressStyle),
          }),
          ...(dressType && {
            dressType: new mongoose.Types.ObjectId(dressType),
          }),
          ...(intendedFor && { intendedFor }),
          ...(search && {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
          }),
        },
      },

      // STAGE 2: Lookup and Populate Category
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      // STAGE 3: Lookup and Populate DressStyle (if exists)
      {
        $lookup: {
          from: "dressstyles",
          localField: "dressStyle",
          foreignField: "_id",
          as: "dressStyle",
        },
      },
      { $unwind: { path: "$dressStyle", preserveNullAndEmptyArrays: true } },

      // STAGE 4: Lookup and Populate DressType (if exists)
      {
        $lookup: {
          from: "dresstypes",
          localField: "dressType",
          foreignField: "_id",
          as: "dressType",
        },
      },
      { $unwind: { path: "$dressType", preserveNullAndEmptyArrays: true } },

      // STAGE 5: Lookup Variants
      {
        $lookup: {
          from: "productvariants",
          localField: "variants",
          foreignField: "_id",
          as: "variants",
        },
      },

      // STAGE 6: Unwind Variants for Filtering
      { $unwind: "$variants" },

      // STAGE 7: Populate Variant Color
      {
        $lookup: {
          from: "colors",
          localField: "variants.color.primary",
          foreignField: "_id",
          as: "variants.color.primary",
        },
      },
      { $unwind: "$variants.color.primary" },

      // STAGE 8: Populate Variant Sizes
      {
        $lookup: {
          from: "sizes",
          localField: "variants.size",
          foreignField: "_id",
          as: "variants.size",
        },
      },

      // STAGE 9: Apply Variant Filters
      {
        $match: {
          ...(color && {
            "variants.color.primary._id": new mongoose.Types.ObjectId(color),
          }),
          ...(maxPrice && { "variants.price": { $lte: parseFloat(maxPrice) } }),
          ...(size && {
            "variants.size": {
              $elemMatch: { _id: new mongoose.Types.ObjectId(size) },
            },
          }),
        },
      },

      // STAGE 10: Group Back Products with Filtered Variants
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          intendedFor: { $first: "$intendedFor" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          category: { $first: "$category" },
          dressStyle: { $first: "$dressStyle" },
          dressType: { $first: "$dressType" },
          variants: { $push: "$variants" },
        },
      },

      // STAGE 11: Final Sorting
      { $sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 } },

      // STAGE 12: Pagination
      { $skip: skip },
      { $limit: limitInt },
    ];

    const products = await ProductModel.aggregate(pipeline);

    // Count total matching products
    const countPipeline = [...pipeline];
    countPipeline.splice(-3); // Remove sorting and pagination stages
    const total =
      (await ProductModel.aggregate([...countPipeline, { $count: "total" }]))[0]
        ?.total || 0;

    // Response with fully populated data
    return {
      success: true,
      message: "Products fetched successfully",
      products: products.map((product) => ({
        ...product,
        // Ensure variants.size is properly structured
        variants: product.variants.map((variant) => ({
          ...variant,
          size: variant.size || [], // Ensure size is always an array
        })),
      })),
      total,
      page: pageInt,
      pages: Math.ceil(total / limitInt),
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
