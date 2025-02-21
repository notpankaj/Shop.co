const DressTypeModel = require("../models/DressType.model");
const DressStyleModel = require("../models/DressStyle.model");

class AdminService {
  /**
   * Create a new Dress Type
   */
  static async createDressType(data) {
    const { name } = data.body;

    const existingDressType = await DressTypeModel.findOne({ name });
    if (existingDressType) {
      throw new Error("Dress Type already exists");
    }
    const newDressType = new DressTypeModel({ name });
    await newDressType.save();
    return {
      success: true,
      message: "New Dress Type created successfully",
      data: newDressType,
    };
  }

  /**
   * Get all Dress Types
   */
  static async getAllDressTypes() {
    const list = await DressTypeModel.find({});
    return {
      success: true,
      message: "Dress Types fetched successfully",
      data: list,
    };
  }

  /**
   * Create a new Dress Style
   */
  static async createDressStyle(data) {
    const { name } = data.body;

    const existingDressStyle = await DressStyleModel.findOne({ name });
    if (existingDressStyle) {
      throw new Error("Dress Style already exists");
    }

    const newDressStyle = new DressStyleModel({ name });
    await newDressStyle.save();
    return {
      success: true,
      message: "New Dress Style created successfully",
      data: newDressStyle,
    };
  }

  /**
   * Get all Dress Styles
   */
  static async getAllDressStyles() {
    const list = await DressStyleModel.find({});
    return {
      success: true,
      message: "Dress Styles fetched successfully",
      data: list,
    };
  }
}

module.exports = AdminService;
