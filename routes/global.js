const express = require("express");
const route = express.Router();
const globalController = require("../controllers/GlobalController");
const uploadMultipleImage = require("../utils/fileUploader");

route.get("/check-email", globalController.emailCheck);
route.get("/test", uploadMultipleImage, globalController.test);

module.exports = route;
