const express = require("express");
const route = express.Router();
const sizeController = require("../controllers/SizeController");

route.post("/", sizeController.create);
route.get("/", sizeController.getAll);

module.exports = route;
