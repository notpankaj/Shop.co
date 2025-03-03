const fileDelete = require("../utils/FileDelete.util");

const {
  OK,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../utils/StatusCode.util");

class GlobalController {
  async test(req, res) {
    res.status(OK).json({
      message: "Test successfully",
    });
  }
}

module.exports = new GlobalController();
