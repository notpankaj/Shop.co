const express = require("express");
const route = express.Router();
const categoryController = require("../controllers/Category.controller");

route.post("/", categoryController.create);
route.get("/", categoryController.getAll);

module.exports = route;
