const { loggerUtil } = require("../utils/Logger.util");

const GlobalRoutes = require("./Global.routes");
const AuthRoutes = require("./Auth.routes");
const ProductRoutes = require("./Product.routes");
const CategoryRoutes = require("./Category.routes");
const ColorRoutes = require("./Color.routes");
const VarientRoutes = require("./Varient.routes");
const SizeRoutes = require("./Size.routes");
const AdminRoutes = require("./Admin.routes");
const BrandRoutes = require("./Brand.routes");
const AddressRoutes = require("./Address.routes");
const AdminMiddleware = require("../middleware/Admin.middleware");

const routes = (app) => {
  // Test Route for API
  app.get("/welcome", (req, res) => {
    loggerUtil("Welcome API called.:.");
    res.send("Welcome to API for Passionett.\n Servers are Up and Running");
  });
  app.use("/api/v1", GlobalRoutes);
  app.use("/api/v1/admin", AdminMiddleware, AdminRoutes);
  app.use("/api/v1/auth", AuthRoutes);
  app.use("/api/v1/product", ProductRoutes);
  app.use("/api/v1/varient", VarientRoutes);
  app.use("/api/v1/category", CategoryRoutes);
  app.use("/api/v1/color", ColorRoutes);
  app.use("/api/v1/size", SizeRoutes);
  app.use("/api/v1/brand", BrandRoutes);
  app.use("/api/v1/address", AddressRoutes);

  return app;
};

module.exports = routes;
