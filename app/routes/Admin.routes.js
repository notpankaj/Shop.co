const express = require("express");
const route = express.Router();

const AdminController = require("../controllers/Admin.controller");

route.post("/dress-type/create", AdminController.createDressType);
route.post("/dress-style/create", AdminController.createDressStyle);

module.exports = route;
