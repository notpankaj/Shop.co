const bcrypt = require("bcrypt");
const {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
} = require("../utils/statusCode");
const UserModel = require("../models/userModel");

class AuthController {
  async register(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Validation for email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ success: false, message: "Invalid email format" });
      }
      if (!email) {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ success: false, message: "email is required" });
      }

      const userCheck = await UserModel.findOne({ email: email });
      if (userCheck && userCheck.email === email) {
        return res.status(BAD_REQUEST).json({
          success: false,
          error: "Email already registered!",
        });
      }

      // Validation for firstName
      if (!firstName) {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ success: false, message: "firstName is required" });
      }
      if (firstName.trim().length < 2) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "firstName length must be at least 2 characters!",
        });
      }
      // Validation for lastName
      if (!lastName) {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ success: false, message: "lastName is required" });
      }
      if (lastName.trim().length < 2) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "lastName length must be at least 2 characters!",
        });
      }
      // Validation for password
      if (!password) {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ success: false, message: "password is required" });
      }
      if (password.trim().length < 4) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "password length must be at least 4 characters!",
        });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new UserModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      const userResponse = { ...newUser._doc };
      delete userResponse.password;
      delete userResponse.__v;

      res.status(OK).json({
        success: true,
        message: "User created successfully",
        data: userResponse,
      });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation for email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ success: false, message: "Invalid email format" });
      }
      if (!email) {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ success: false, message: "email is required" });
      }
      // Validation for password
      if (!password) {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ success: false, message: "password is required" });
      }
      if (password.trim().length < 4) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "password length must be at least 4 characters!",
        });
      }

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res
          .status(NOT_FOUND)
          .json({ success: false, message: "User not found is required" });
      }
      const hashedPassword = user.password;
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);
      if (!isPasswordValid) {
        return res
          .status(UNAUTHORIZED)
          .json({ success: false, message: "Invalid credentials" });
      }
      const userResponse = { ...user._doc };
      delete userResponse.password;
      delete userResponse.__v;

      res.status(OK).json({
        success: true,
        message: "User login successfully",
        data: userResponse,
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

module.exports = new AuthController();
