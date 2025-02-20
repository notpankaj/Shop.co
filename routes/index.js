const { loggerUtil } = require("../utils/logger");
const express = require("express");
// const userRoute = require("./user");
const globalRoute = require("./global");
const authRoute = require("./auth");
const productRoute = require("./product");
const categoryRoute = require("./category");
const colorRoute = require("./color");
const varientRoute = require("./varient");
const sizeRoute = require("./size");
const adminRoute = require("./admin");

const routes = (app) => {
  // Test Route for API
  app.get("/welcome", (req, res) => {
    loggerUtil("Welcome API called.:.");
    res.send("Welcome to API for Passionett.\n Servers are Up and Running");
  });
  app.use(
    "/api/v1",
    [
      express.urlencoded({ extended: true, limit: "200mb" }),
      express.json({ limit: "200mb", extended: true }),
    ],
    globalRoute
  );
  app.use(
    "/api/v1/auth",
    [
      express.urlencoded({ extended: true, limit: "200mb" }),
      express.json({ limit: "200mb", extended: true }),
    ],
    authRoute
  );
  app.use(
    "/api/v1/product",
    [
      express.urlencoded({ extended: true, limit: "200mb" }),
      express.json({ limit: "200mb", extended: true }),
    ],
    productRoute
  );
  app.use(
    "/api/v1/category",
    [
      express.urlencoded({ extended: true, limit: "200mb" }),
      express.json({ limit: "200mb", extended: true }),
    ],
    categoryRoute
  );
  app.use(
    "/api/v1/color",
    [
      express.urlencoded({ extended: true, limit: "200mb" }),
      express.json({ limit: "200mb", extended: true }),
    ],
    colorRoute
  );
  app.use(
    "/api/v1/varient",
    [
      express.urlencoded({ extended: true, limit: "200mb" }),
      express.json({ limit: "200mb", extended: true }),
    ],
    varientRoute
  );
  app.use(
    "/api/v1/size",
    [
      express.urlencoded({ extended: true, limit: "200mb" }),
      express.json({ limit: "200mb", extended: true }),
    ],
    sizeRoute
  );
  app.use(
    "/api/v1/admin",
    [
      express.urlencoded({ extended: true, limit: "200mb" }),
      express.json({ limit: "200mb", extended: true }),
    ],
    adminRoute
  );
  return app;
};

module.exports = routes;
