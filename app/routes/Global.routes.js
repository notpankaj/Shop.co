const express = require("express");
const route = express.Router();
const globalController = require("../controllers/Global.controller");
const AuthMiddleware = require("../middleware/Auth.middleware");

route.get("/test", AuthMiddleware, globalController.test);

module.exports = route;
