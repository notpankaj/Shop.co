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
    if (user.isDeleted) {
      throw new Error("User Account is Not Accessable!");
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
  /**
   * User Delete
   */
  static async userDelete(data) {
    const { id } = data.params;

    const userCheck = await UserModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!userCheck) {
      throw new Error("User not Found!");
    }

    return {
      success: true,
      message: "User delete successfully",
      data: userCheck,
    };
  }

  /**
   * User Req Forget Code
   */
  static async requestForgetCode(data) {
    return {
      success: true,
      message: "send code to email successfully",
      data: {},
    };
  }

  /**
   * Forget password
   */
  static async forgetPassword(data) {
    return {
      success: true,
      message: "Set New Password successfully",
      data: {},
    };
  }

  /**
   * Change Password
   */
  static async changePassword(data) {
    const userId = data.params.id;
    const { oldPassword, newPassword } = data.body;

    if (!oldPassword) {
      throw new Error("Old Password is Require!");
    }

    if (!newPassword) {
      throw new Error("New Password is Require!");
    }
    if (newPassword.length < 4) {
      throw new Error("New Password must be 4 charater long is Require!");
    }

    const userCheck = await UserModel.findById(userId);

    if (!userCheck) {
      throw new Error("User Not Found!");
    }

    const hashedPassword = userCheck.password;
    const isPasswordValid = await bcrypt.compare(oldPassword, hashedPassword);
    if (!isPasswordValid) {
      throw new Error("Old Password is Invalid");
    }

    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

    userCheck.password = newHashedPassword;
    await userCheck.save();

    return {
      success: true,
      message: "Change Password successfully",
      data: userCheck,
    };
  }
}

module.exports = AuthService;
