const BrandModel = require("../models/Brand.model");
const CloudStorage = require("../utils/CloudStorage.util");
const fileDelete = require("../utils/FileDelete.util");

class BrandService {
  /**
   * Create a new Brand
   */
  static async create(data) {
    const { name } = data.body;
    const poster = data.files["poster"][0];
    const icon = data.files["icon"][0];

    try {
      const brandCheck = await BrandModel.findOne({ name });

      if (brandCheck) {
        throw new Error("Brand already exsits!");
      }

      let posterUrl = "";
      let iconUrl = "";
      if (poster) {
        const result = await CloudStorage.fileUpload(poster.filename);
        posterUrl = result.url;
      }
      if (icon) {
        const result = await CloudStorage.fileUpload(icon.filename);
        iconUrl = result.url;
      }

      const newBrand = new BrandModel({
        name,
      });

      if (posterUrl) {
        newBrand.poster = posterUrl;
      }
      if (iconUrl) {
        newBrand.icon = iconUrl;
      }

      await newBrand.save();

      return {
        success: true,
        message: "New Brand created successfully",
        data: newBrand,
      };
    } catch (error) {
      throw new Error(error.message);
    } finally {
      if (poster) {
        fileDelete(poster.filename);
      }
      if (icon) {
        fileDelete(icon.filename);
      }
    }
  }

  /**
   * Get all Brand
   */
  static async getAll() {
    const list = await BrandModel.find({});
    return {
      success: true,
      message: "Brand fetched successfully",
      data: list,
    };
  }
}

module.exports = BrandService;
