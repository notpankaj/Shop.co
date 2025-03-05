const express = require("express");
const route = express.Router();
const productController = require("../controllers/Product.controller");
const BrandMiddleware = require("../middleware/Brand.middleware");
const AuthMiddleware = require("../middleware/Auth.middleware");

route.post(
  "/create",
  AuthMiddleware,
  BrandMiddleware,
  productController.create
);
route.get("/", productController.getAll);

module.exports = route;
