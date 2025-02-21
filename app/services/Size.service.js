const SizeModel = require("../models/Size.model");

class SizeService {
  /**
   * Create a new Size
   */
  static async create(data) {
    const { name } = data.body;

    const checkExist = await SizeModel.findOne({ name });
    if (checkExist) {
      throw new Error("Size already exists");
    }

    const newSize = new SizeModel({ name });
    await newSize.save();
    return {
      success: true,
      message: "New Size created successfully",
      data: newSize,
    };
  }

  /**
   * Get all Sizes
   */
  static async getAll() {
    const list = await SizeModel.find({});
    return {
      success: true,
      message: "Sizes fetched successfully",
      data: list,
    };
  }
}

module.exports = SizeService;
