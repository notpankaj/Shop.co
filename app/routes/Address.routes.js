const express = require("express");
const AuthMiddleware = require("../middleware/Auth.middleware");
const route = express.Router();
const AddressController = require("../controllers/Address.controller");


route.post("/", AuthMiddleware, AddressController.addAddress);
route.put("/:addressId", AuthMiddleware, AddressController.editAddress);
route.delete("/:addressId", AuthMiddleware, AddressController.deleteAddress);
route.get("/", AuthMiddleware, AddressController.getAddresses);

module.exports = route;
