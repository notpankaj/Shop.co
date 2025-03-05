const express = require("express");
const route = express.Router();
const categoryController = require("../controllers/Category.controller");
const AdminMiddleware = require("../middleware/Admin.middleware");
const AuthMiddleware = require("../middleware/Auth.middleware");

route.post("/", AuthMiddleware, AdminMiddleware, categoryController.create);
route.get("/", categoryController.getAll);

module.exports = route;
