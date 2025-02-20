const express = require("express");
const route = express.Router();
const colorController = require("../controllers/ColorController");

route.post("/", colorController.create);
route.get("/", colorController.getAll);

module.exports = route;
