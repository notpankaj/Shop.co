const express = require("express");
const route = express.Router();
const globalController = require("../controllers/Global.controller");
const AuthMiddleware = require("../middleware/Auth.middleware");
const BrandMiddleware = require("../middleware/Brand.middleware");
const AdminMiddleware = require("../middleware/Admin.middleware");

route.get("/test", AuthMiddleware, AdminMiddleware, globalController.test);

module.exports = route;
