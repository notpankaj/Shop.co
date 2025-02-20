const cnf = require("dotenv").config;
cnf();

// MONGODB DETAILS
const MONGO_USERNAME = "";
const MONGO_PASSWORD = "";
const MONGO_DATABASE = "ecommerce";
const MONGO_STRING = process.env.MONGO_DB_URL || `mongodb://localhost:27017/`;

const MONGO = {
  username: MONGO_USERNAME,
  password: MONGO_PASSWORD,
  database: MONGO_DATABASE,
  string: MONGO_STRING,
};

// // SERVER DETAILS
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.PORT || 8080;
// const JWT_SECRET = process.env.JWT_SECRET || "";
// const CDN = "";

// //keys details
// const KEYS = {
//   jwt_secret: JWT_SECRET,
// };

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
};

// // AWS s3 details
// const AWS = {
//   accessKeyId: "",
//   secretAccessKey: "",
//   region: "us-east-1",
//   bucket: "",
//   cdn: CDN,
// };

// const STRIPE = {
//   sk_test: "",
//   pk_test: "",
//   sk_live: "",
//   plk_live: "",
// };

// const HOSTNAME = {
//   local: "http://127.0.0.1:5002",
//   dev: "",
//   frontend: "",
// };

const config = {
  mongo: MONGO,
  server: SERVER,
  //   keys: KEYS,
  //   aws: AWS,
  //   hostname: HOSTNAME,
};

module.exports = config;
