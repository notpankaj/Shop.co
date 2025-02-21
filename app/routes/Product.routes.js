const express = require("express");
const route = express.Router();
const productController = require("../controllers/Product.controller");

route.post("/create", productController.create);
route.get("/", productController.getAll);

module.exports = route;
