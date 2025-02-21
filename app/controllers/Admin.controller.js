const bcrypt = require("bcrypt");
const {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
} = require("../utils/StatusCode.util");

const DressTypeModel = require("../models/DressType.model");
const DressStyleModel = require("../models/DressStyle.model");

class AdminController {
  async createDressType(req, res) {
    try {
      const { name } = req.body;
      // Validation for Name
      if (!name) {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ success: false, message: "name is required" });
      }
      if (name.trim().length < 2) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "name length must be at least 2 characters!",
        });
      }

      const newDressType = new DressTypeModel({
        name,
      });
      await newDressType.save();

      res.status(OK).json({
        success: true,
        message: "New Dress Type created successfully",
        data: newDressType,
      });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  }
  async getAllDressType(req, res) {
    try {
      const list = await DressTypeModel.find({});
      res.status(OK).json({
        success: true,
        message: "Dress Type fetch created successfully",
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
  async createDressStyle(req, res) {
    try {
      const { name } = req.body;
      // Validation for Name
      if (!name) {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ success: false, message: "name is required" });
      }
      if (name.trim().length < 2) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "name length must be at least 2 characters!",
        });
      }

      const newDressType = new DressStyleModel({
        name,
      });
      await newDressType.save();

      res.status(OK).json({
        success: true,
        message: "New Dress Style created successfully",
        data: newDressType,
      });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  }
  async getAllDressStyle(req, res) {
    try {
      const list = await DressStyleModel.find({});
      res.status(OK).json({
        success: true,
        message: "Dress Styles fetch created successfully",
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

module.exports = new AdminController();
