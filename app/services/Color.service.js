const ColorModel = require("../models/Color.model");

class ColorService {
  /**
   * Create a new Color
   */
  static async create(data) {
    const { name, code } = data.body;
    const newColor = new ColorModel({
      name,
      code,
    });
    await newColor.save();

    return {
      success: true,
      message: "New Category created successfully",
      data: newCatrgory,
    };
  }

  /**
   * Get all Colors
   */
  static async getAll() {
    const list = await ColorModel.find({});
    return {
      success: true,
      message: "Colors fetched successfully",
      data: list,
    };
  }
}

module.exports = ColorService;
