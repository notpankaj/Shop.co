const CategoryModel = require("../models/Category.model");

class CategoryService {
  /**
   * Create a new Category
   */
  static async create(data) {
    const { name } = data.body;

    const checkExist = await CategoryModel.findOne({ name });
    if (checkExist) {
      throw new Error("Category already exists");
    }
    const newCatrgory = new CategoryModel({ name });
    await newCatrgory.save();
    return {
      success: true,
      message: "New Category created successfully",
      data: newCatrgory,
    };
  }

  /**
   * Get all Categories
   */
  static async getAll() {
    const list = await CategoryModel.find({});
    return {
      success: true,
      message: "Categories fetched successfully",
      data: list,
    };
  }
}

module.exports = CategoryService;
