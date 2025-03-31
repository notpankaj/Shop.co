const express = require("express");
const route = express.Router();
const globalController = require("../controllers/Global.controller");
const AuthMiddleware = require("../middleware/Auth.middleware");
const BrandMiddleware = require("../middleware/Brand.middleware");
const AdminMiddleware = require("../middleware/Admin.middleware");
const GlobalController = require("../controllers/Global.controller");

route.get("/test", AuthMiddleware, AdminMiddleware, globalController.test);
route.get("/dress-style", GlobalController.getAllDressStyle);
route.get("/dress-type", GlobalController.getAllDressType);

module.exports = route;
