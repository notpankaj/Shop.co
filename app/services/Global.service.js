const DressTypeModel = require("../models/DressType.model");
const DressStyleModel = require("../models/DressStyle.model");

class GlobalService {
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

module.exports = GlobalService;
