const User = require("../models/userModel");
const fileDelete = require("../utils/fileDelete");

const {
  OK,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../utils/statusCode");

class GlobalController {
  async emailCheck(req, res) {
    try {
      const { email } = req.query;
      if (!email) {
        return res
          .status(BAD_REQUEST)
          .json({ success: false, message: "Email is required" });
      }
      const user = await User.findOne({ email: email.trim() });
      const exists = !!user;
      res.status(OK).json({ success: true, emailExists: exists });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  }
  async test(req, res) {
    if (!req.files || req.files.length < 1) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const filenames = [];

    for (let image of req.files) {
      filenames.push(image.filename);
    }

    // remove
    for (let image of req.files) {
      fileDelete(image.filename);
    }

    res.json({
      message: "File uploaded successfully",
      data: {
        path: filenames,
      },
    });
  }
}

module.exports = new GlobalController();
