const { OK, BAD_REQUEST } = require("../utils/StatusCode.util");

const AdminService = require("../services/Admin.service");

class AdminController {
  /**
   * Create a new Dress Type
   */
  async createDressType(req, res) {
    try {
      const data = { body: req.body };
      const result = await AdminService.createDressType(data);
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllDressType(req, res) {
    try {
      const result = await AdminService.getAllDressTypes();
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
  /**
   * Create a new Dress Type
   */
  async createDressStyle(req, res) {
    try {
      const data = { body: req.body };
      const result = await AdminService.createDressStyle(data);
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllDressStyle(req, res) {
    try {
      const result = await AdminService.getAllDressStyles();
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AdminController();
