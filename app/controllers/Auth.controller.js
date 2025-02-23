const { OK, BAD_REQUEST } = require("../utils/StatusCode.util");

const AuthService = require("../services/Auth.service");

class AuthController {
  /**
   * User Register
   */
  async register(req, res) {
    try {
      const result = await AuthService.register(req);
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
  async login(req, res) {
    try {
      const result = await AuthService.login(req);

      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
