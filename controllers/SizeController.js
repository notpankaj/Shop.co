const productSizeModel = require("../models/productSizeModel");
const { OK, INTERNAL_SERVER_ERROR } = require("../utils/statusCode");

class SizeController {
  async create(req, res) {
    try {
      const { name } = req.body;
      const newSize = new productSizeModel({
        name,
      });
      await newSize.save();
      res
        .status(OK)
        .json({ success: true, message: "Size Create", data: newSize });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  }
  async getAll(req, res) {
    try {
      const list = await productSizeModel.find({});
      res.status(OK).json({
        success: true,
        message: "Size fetch successfully!",
        data: list,
      });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  }
}

module.exports = new SizeController();
