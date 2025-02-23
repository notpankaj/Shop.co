const bcrypt = require("bcrypt");
const UserModel = require("../models/User.model");

class AuthService {
  /**
   * User Register
   */
  static async register(data) {
    const { firstName, lastName, email, password } = data.body;

    // Validation for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    if (!email) {
      throw new Error("email is required");
    }

    const userCheck = await UserModel.findOne({ email: email });
    if (userCheck && userCheck.email === email) {
      throw new Error("Email already registered!");
    }

    // Validation for firstName
    if (!firstName) {
      throw new Error("firstName is required");
    }
    if (firstName.trim().length < 2) {
      throw new Error("firstName length must be at least 2 characters!");
    }
    // Validation for lastName
    if (!lastName) {
      throw new Error("lastName is required");
    }
    if (lastName.trim().length < 2) {
      throw new Error("lastName length must be at least 2 characters!");
    }
    // Validation for password
    if (!password) {
      throw new Error("password is required");
    }
    if (password.trim().length < 4) {
      throw new Error("password length must be at least 4 characters!");
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

    return {
      success: true,
      message: "User register successfully",
      data: userResponse,
    };
  }

  /**
   * User Login
   */

  static async login(data) {
    const { email, password } = data.body;

    // Validation for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    if (!email) {
      throw new Error("email is required");
    }
    // Validation for password
    if (!password) {
      throw new Error("password is required");
    }
    if (password.trim().length < 4) {
      throw new Error("password length must be at least 4 characters!");
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("User not found is required");
    }
    const hashedPassword = user.password;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    const userResponse = { ...user._doc };
    delete userResponse.password;
    delete userResponse.__v;

    return {
      success: true,
      message: "User login successfully",
      data: userResponse,
    };
  }
}

module.exports = AuthService;
