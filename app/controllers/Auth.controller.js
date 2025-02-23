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
  /**
   * User login
   */
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

  /**
   * User Delete
   */
  async userDelete(req, res) {
    try {
      const result = await AuthService.userDelete(req);
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * req forget  code
   */
  async requestForgetCode(req, res) {
    try {
      const result = await AuthService.requestForgetCode(req);
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * forget Password
   */
  async forgetPassord(req, res) {
    try {
      const result = await AuthService.forgetPassword(req);
      res.status(OK).json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * change Password
   */
  async changePassowrd(req, res) {
    try {
      const result = await AuthService.changePassword(req);
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
