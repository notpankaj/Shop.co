const KEYS = require("./keys");

// MONGODB DETAILS
const MONGO_USERNAME = "";
const MONGO_PASSWORD = "";
const MONGO_DATABASE = "ecommerce";
const MONGO_STRING = KEYS.MONGO_DB_URL;

const MONGO = {
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    database: MONGO_DATABASE,
    string: MONGO_STRING,
};

module.exports = MONGO 