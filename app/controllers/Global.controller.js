const GlobalService = require("../services/Global.service");
const fileDelete = require("../utils/FileDelete.util");

const { OK, BAD_REQUEST } = require("../utils/StatusCode.util");

class GlobalController {
  async test(req, res) {
    res.status(OK).json({
      message: "Test successfully",
    });
  }
  /**
   * Get all Dress Styles
   */
  async getAllDressStyle(req, res) {
    try {
      const result = await GlobalService.getAllDressStyles();
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
  /**
   * Get all Dress Types
   */
  async getAllDressType(req, res) {
    try {
      const result = await GlobalService.getAllDressTypes();
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new GlobalController();
