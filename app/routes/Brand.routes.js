const express = require("express");
const route = express.Router();
const BrandController = require("../controllers/Brand.controller");
const { fileUploader } = require("../utils/FileUploader.util");

route.post(
  "/create",
  fileUploader.fields([
    { name: "poster", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  BrandController.create
);
route.get("/", BrandController.getAll);

module.exports = route;
