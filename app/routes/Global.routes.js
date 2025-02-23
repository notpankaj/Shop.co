const express = require("express");
const route = express.Router();
const globalController = require("../controllers/Global.controller");
const { uploadMultipleImage } = require("../utils/FileUploader.util");

route.get("/test", uploadMultipleImage, globalController.test);

module.exports = route;
