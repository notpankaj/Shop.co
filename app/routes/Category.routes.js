const express = require("express");
const route = express.Router();
const categoryController = require("../controllers/ProductCategoryController");

route.post("/", categoryController.create);
route.get("/", categoryController.getAll);

module.exports = route;
