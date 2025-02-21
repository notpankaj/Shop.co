const ColorModel = require("../models/Color.model");
const { OK, INTERNAL_SERVER_ERROR } = require("../utils/StatusCode.util");

class ColorController {
  async create(req, res) {
    try {
      const { name, code } = req.body;
      const newColor = new ColorModel({
        name,
        code,
      });
      await newColor.save();
      res
        .status(OK)
        .json({ success: true, message: "Color Create", data: newColor });
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
      const list = await ColorModel.find({});

      res.status(OK).json({
        success: true,
        message: "Color get successfuly",
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

module.exports = new ColorController();
