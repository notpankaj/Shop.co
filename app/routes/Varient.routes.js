const express = require("express");
const route = express.Router();
const varientController = require("../controllers/Varient.controller");
const uploadMultipleImage = require("../utils/FileDelete.util");

route.post("/create", uploadMultipleImage, varientController.create);

module.exports = route;
