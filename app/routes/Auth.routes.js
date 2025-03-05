const express = require("express");
const route = express.Router();
const authController = require("../controllers/Auth.controller");
const AuthMiddleware = require("../middleware/Auth.middleware");

route.post("/register", authController.register);
route.post("/login", authController.login);
route.get("/profile", AuthMiddleware, authController.getProfile);
route.delete("/delete", AuthMiddleware, authController.userDelete);
route.post("/requestForgetCode", authController.requestForgetCode);
route.put("/forgetPassord", authController.forgetPassord);
route.put("/changePassword", AuthMiddleware, authController.changePassowrd);

module.exports = route;
