const express = require("express");
const route = express.Router();
const colorController = require("../controllers/Color.controller");
const BrandMiddleware = require("../middleware/Brand.middleware");
const AuthMiddleware = require("../middleware/Auth.middleware");

route.post("/", AuthMiddleware, BrandMiddleware, colorController.create);
route.get("/", colorController.getAll);

module.exports = route;
