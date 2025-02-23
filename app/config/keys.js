const cnf = require("dotenv").config;
cnf();

const SERVER_PORT = process.env.PORT;
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME;
const MONGO_DB_URL = process.env.MONGO_DB_URL || `mongodb://localhost:27017/`;
const SALT = process.env.SALT;
const SECRET = process.env.SECRET;

const CLOUDNARY_CLOUD_NAME = process.env.CLOUDNARY_CLOUD_NAME;
const CLOUDNARY_API_KEY = process.env.CLOUDNARY_API_KEY;
const CLOUDNARY_API_SECRET = process.env.CLOUDNARY_API_SECRET;

const KEYS = {
  MONGO_DB_URL,
  SERVER_HOSTNAME,
  SERVER_PORT,
  SALT,
  SECRET,
  CLOUDNARY_CLOUD_NAME,
  CLOUDNARY_API_KEY,
  CLOUDNARY_API_SECRET,
};

module.exports = KEYS;
