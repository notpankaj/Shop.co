const express = require("express");
const route = express.Router();
const AdminController = require("../controllers/AdminController");

route.post("/dress-type/create", AdminController.createDressType);
route.get("/dress-type", AdminController.getAllDressType);

route.post("/dress-style/create", AdminController.createDressStyle);
route.get("/dress-style", AdminController.getAllDressStyle);

module.exports = route;
