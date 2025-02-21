const express = require("express");
const route = express.Router();
const varientController = require("../controllers/ProductVarientController");
const uploadMultipleImage = require("../utils/fileUploader");

route.post("/create", uploadMultipleImage, varientController.create);

module.exports = route;
