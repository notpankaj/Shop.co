const express = require("express");
const route = express.Router();
const authController = require("../controllers/Auth.controller");

route.post("/register", authController.register);
route.post("/login", authController.login);
route.delete("/delete/:id", authController.userDelete);
route.post("/requestForgetCode", authController.requestForgetCode);
route.put("/forgetPassord", authController.forgetPassord);
route.put("/changePassword", authController.changePassowrd);

module.exports = route;
