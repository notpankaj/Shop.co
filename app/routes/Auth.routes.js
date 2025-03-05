const express = require("express");
const route = express.Router();
const authController = require("../controllers/Auth.controller");
const AuthMiddleware = require("../middleware/Auth.middleware");
const { fileUploader } = require("../utils/FileUploader.util");
const BrandMiddleware = require("../middleware/Brand.middleware");

route.post("/register", authController.register);
route.post("/login", authController.login);
route.get("/profile", AuthMiddleware, authController.getProfile);
route.put(
  "/profile",
  AuthMiddleware,
  fileUploader.fields([{ name: "picture", maxCount: 1 }]),
  authController.updateUserProfile
);
route.put(
  "/profile/brand",
  AuthMiddleware,
  BrandMiddleware,
  fileUploader.fields([
    { name: "poster", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  authController.updateBrandProfile
);
route.delete("/delete", AuthMiddleware, authController.userDelete);
route.post("/requestForgetCode", authController.requestForgetCode);
route.put("/forgetPassord", authController.forgetPassord);
route.put("/changePassword", AuthMiddleware, authController.changePassowrd);

module.exports = route;
