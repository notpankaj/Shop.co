const express = require("express");
const route = express.Router();
const varientController = require("../controllers/Varient.controller");
const { uploadMultipleImage } = require("../utils/FileUploader.util");
const BrandMiddleware = require("../middleware/Brand.middleware");
const AuthMiddleware = require("../middleware/Auth.middleware");

route.post(
  "/create",
  AuthMiddleware,
  BrandMiddleware,
  uploadMultipleImage,
  varientController.create
);

module.exports = route;
