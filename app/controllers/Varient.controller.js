const { default: mongoose } = require("mongoose");

// Utils
const { OK, INTERNAL_SERVER_ERROR } = require("../utils/StatusCode.util");
const fileDelete = require("../utils/FileDelete.util");

//Model
const productModel = require("../models/Product.model");
const productVarientModel = require("../models/Variant.model");
const ProductSizeModel = require("../models/Size.model");
const colorModel = require("../models/Color.model");

class ProductVarientController {
  async create(req, res) {
    try {
      const productId = req.query?.product || undefined;
      if (!productId) {
        throw new Error("Product Id is required!");
      }
      if (!mongoose.isValidObjectId(productId)) {
        throw new Error("Invalid Product ID!");
      }
      //check if product exsist
      const productCheck = await productModel.findById(productId);
      if (!productCheck) {
        throw new Error("Product not found!");
      }

      const { price, size, color } = req.body;

      // check for price
      if (!price) {
        throw new Error("Price is requried!");
      }
      // check for colors
      if (!color["primary"]) {
        throw new Error("Primary Color is Required!");
      }
      if (!mongoose.isValidObjectId(color["primary"])) {
        throw new Error("Invalid Primary Color ID!");
      }
      const colorCheck = await colorModel.findById(color["primary"]);
      if (!colorCheck) {
        throw new Error("Color not found!");
      }
      if (!color["secondary"]) {
        throw new Error("Secondary Color is Required!");
      }
      // check for size
      if (!size) {
        throw new Error("Size is Required!");
      }
      if (!mongoose.isValidObjectId(size)) {
        throw new Error("Invalid Size ID!");
      }
      const sizeCheck = await ProductSizeModel.findById(size);
      if (!sizeCheck) {
        throw new Error("Size not found!");
      }

      // IMAGE HANDLING
      const photoPaths = [];
      if (req.files?.length < 1) {
        throw new Error("Product Must have atleast one Image!");
      }

      for (let img of req.files) {
        photoPaths.push(img.filename);
      }

      const newVarient = new productVarientModel({
        photos: photoPaths,
        color: {
          primary: colorCheck,
          secondary: color["secondary"],
        },
        price: price,
        size: sizeCheck,
      });

      await newVarient.save();
      productCheck.variants.push(newVarient._id);
      await productCheck.save();
      // response
      res.status(OK).json({
        success: true,
        message: "Varient Create",
        data: productCheck,
      });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    } finally {
      for (let img of req.files) {
        fileDelete(img.filename);
      }
    }
  }
}

module.exports = new ProductVarientController();
