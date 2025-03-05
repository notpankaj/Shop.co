const bcrypt = require("bcrypt");
const UserModel = require("../models/User.model");
const jwt = require("jsonwebtoken");
const KEYS = require("../config/keys");
const BrandProfileModel = require("../models/BrandProfile.model");
const CustomerProfileModel = require("../models/CustomerProfile.model");
const CloudStorage = require("../utils/CloudStorage.util");
const fileDelete = require("../utils/FileDelete.util");
const MailUtils = require("../utils/Mail.util");
const FPotp = require("../models/ForgetPassword.model");
const { OK, BAD_REQUEST } = require("../utils/StatusCode.util");

class AuthService {
  /**
   * User Register
   */
  static async register(data) {
    const {
      firstName,
      lastName,
      brandName,
      email,
      role = "customer",
      password,
    } = data.body;

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

    // Validation for password
    if (!password) {
      throw new Error("password is required");
    }
    if (password.trim().length < 4) {
      throw new Error("password length must be at least 4 characters!");
    }

    // Role-specific validations
    let profile;
    if (role === "customer") {
      // Validation for firstName
      if (!firstName) {
        throw new Error("First name is required for customers");
      }
      if (firstName.trim().length < 2) {
        throw new Error("First name length must be at least 2 characters!");
      }
      // Validation for lastName
      if (!lastName) {
        throw new Error("Last name is required for customers");
      }
      if (lastName.trim().length < 2) {
        throw new Error("Last name length must be at least 2 characters!");
      }
    } else if (role === "brand") {
      // Validation for brandName
      if (!brandName) {
        throw new Error("Brand name is required for brands");
      }
      if (brandName.trim().length < 2) {
        throw new Error("Brand name length must be at least 2 characters!");
      }
    } else {
      throw new Error("Invalid role specified");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create User
    const newUser = new UserModel({
      email,
      password: hashedPassword,
      role,
    });

    // Create profile based on role
    if (role === "customer") {
      profile = new CustomerProfileModel({
        user: newUser._id,
        firstName,
        lastName,
      });
      newUser.roleModel = "CustomerProfile";
    } else if (role === "brand") {
      profile = new BrandProfileModel({
        user: newUser._id,
        brandName,
      });
      newUser.roleModel = "BrandProfile";
    }

    newUser.profile = profile._id;
    await newUser.save();
    await profile.save();

    const populatedUser = await UserModel.findById(newUser._id).populate(
      "profile"
    );
    const userResponse = {
      ...populatedUser._doc,
      profile: populatedUser.profile,
    };
    delete userResponse.password;
    delete userResponse.__v;

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

    const user = await UserModel.findOne({ email }).populate("profile");

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

    const userResponse = { ...user._doc, profile: user.profile };
    delete userResponse.password;
    delete userResponse.__v;

    const payload = { userId: userResponse._id, role: userResponse.role };
    const token = jwt.sign(payload, KEYS.JWT_SECRET, { expiresIn: "1h" });

    return {
      success: true,
      message: "User login successfully",
      data: { ...userResponse, token },
    };
  }
  /**
   * User Delete
   */
  static async userDelete(data) {
    const id = data.userId;

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
    const { email } = data.body;

    if (!email) {
      throw new Error("Email is required!");
    }

    const userCheck = await UserModel.findOne({ email });

    if (!userCheck) {
      throw new Error("No User Found with this Email!");
    }

    const existingOtp = await FPotp.findOne({ uid: userCheck._id });
    if (existingOtp) {
      return {
        status: OK,
        message: "OTP already generated. Please check your email.",
        data: { userId: userCheck?._id },
      };
    }

    const otpGen = Math.floor(1000 + Math.random() * 9000).toString();
    await MailUtils.sendForgetPasswordMail({ to: email, code: otpGen });

    const otp = new FPotp({
      uid: userCheck._id,
      otp: otpGen,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
    });
    await otp.save();

    return {
      success: true,
      message: "OTP sent successfully. Please check your email.",
      data: { userId: userCheck?._id },
    };
  }

  /**
   * Forget password
   */
  static async forgetPassword(data) {
    const { userId, otp, newPassword } = data.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("No User Found!");
    }

    const veri = await FPotp.findOne({ uid: userId, otp: otp });
    if (!veri) {
      throw new Error("Incorrect or Expired OTP");
    }

    if (!newPassword) {
      throw new Error("New Password is missing!");
    }
    if (newPassword.trim().length < 4) {
      throw new Error("password length must be at least 4 characters!");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await user.save();
    await FPotp.deleteOne({ uid: userId });
    return {
      success: true,
      message: "Set New Password successfully",
    };
  }

  /**
   * Change Password
   */
  static async changePassword(data) {
    const userId = data.userId;
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

    const userCheck = await UserModel.findById(userId).populate("profile");

    if (!userCheck) {
      throw new Error("User Not Found!");
    }
    if (userCheck.isDeleted) {
      throw new Error("User account is not accessible!");
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

    const userResponse = { ...userCheck._doc, profile: userCheck.profile };
    delete userResponse.password;
    delete userResponse.__v;

    return {
      success: true,
      message: "Password changed successfully",
      data: userCheck,
    };
  }
  /**
   * Get Profile
   */
  static async getProfile(data) {
    const userResponse = await data.user.populate("profile");

    return {
      success: true,
      message: "Profile get successfully",
      data: userResponse,
    };
  }
  /**
   * Update Brand Profile
   */
  static async updateBrandProfile(data) {
    const icon = data?.files?.icon[0] || null;
    const poster = data?.files?.poster[0] || null;

    try {
      const userId = data.userId;
      const { phone, brandName, description } = data.body;

      const brandProfile = await BrandProfileModel.findOne({ user: userId });
      if (!brandProfile) {
        throw new Error("Brand profile not found!");
      }

      if (brandName) {
        if (brandName.trim().length < 2) {
          throw new Error("Brand name must be at least 2 characters long!");
        }
        brandProfile.brandName = brandName;
      }
      if (phone) {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(phone)) {
          throw new Error("Please enter a valid phone number!");
        }
        brandProfile.phone = phone;
      }
      if (description) {
        if (description.length > 500) {
          throw new Error("Description cannot exceed 500 characters!");
        }
        brandProfile.description = description;
      }

      if (icon) {
        const res = await CloudStorage.fileUpload(icon.filename);
        brandProfile.icon = res.url;
        //  DELETE OLD FROM CLODNARY
      }

      if (poster) {
        const res = await CloudStorage.fileUpload(poster.filename);
        brandProfile.poster = res.url;
        //  DELETE OLD FROM CLODNARY
      }

      await brandProfile.save();

      const updatedUser = await UserModel.findById(userId).populate("profile");

      return {
        success: true,
        message: "Brand Profile updated successfully",
        data: updatedUser,
      };
    } catch (error) {
      throw new Error(error?.message);
    } finally {
      if (icon) {
        fileDelete(icon.filename);
      }
      if (poster) {
        fileDelete(poster.filename);
      }
    }
  }
  /**
   * Update User Profile
   */
  static async updateUserProfile(data) {
    if (data?.user?._doc?.role !== "customer") {
      throw new Error("Only Customer access this route!");
    }

    const picture = data?.files?.picture[0] || null;

    try {
      const userId = data.userId;
      const { firstName, lastName, gender, phone } = data.body;

      const customerProfile = await CustomerProfileModel.findOne({
        user: userId,
      });
      if (!customerProfile) {
        throw new Error("Customer profile not found!");
      }

      if (firstName) {
        if (firstName.trim().length < 2) {
          throw new Error("firstName must be at least 2 characters long!");
        }
        customerProfile.firstName = firstName;
      }
      if (lastName) {
        if (lastName.trim().length < 2) {
          throw new Error("lastName must be at least 2 characters long!");
        }
        customerProfile.lastName = lastName;
      }
      if (gender) {
        customerProfile.gender = gender;
      }
      if (phone) {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(phone)) {
          throw new Error("Please enter a valid phone number!");
        }
        customerProfile.phone = phone;
      }

      if (picture) {
        const res = await CloudStorage.fileUpload(picture.filename);
        customerProfile.picture = res.url;
        //  DELETE OLD FROM CLODNARY
      }

      await customerProfile.save();

      const updatedUser = await UserModel.findById(userId).populate("profile");

      return {
        success: true,
        message: "Customer Profile updated successfully",
        data: updatedUser,
      };
    } catch (error) {
      throw new Error(error?.message);
    } finally {
      if (picture) {
        fileDelete(picture.filename);
      }
    }
  }
}

module.exports = AuthService;
