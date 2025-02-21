const fileDelete = require("../utils/FileDelete.util");

const {
  OK,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../utils/StatusCode.util");

class GlobalController {
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
