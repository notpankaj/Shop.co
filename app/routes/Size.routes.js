const express = require("express");
const route = express.Router();
const sizeController = require("../controllers/Size.controller");
const AdminMiddleware = require("../middleware/Admin.middleware");
const AuthMiddleware = require("../middleware/Auth.middleware");

route.post("/", AuthMiddleware, AdminMiddleware, sizeController.create);
route.get("/", sizeController.getAll);

module.exports = route;
