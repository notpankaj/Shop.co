const SERVER = require("./app.conf");
const MONGO = require("./db.conf");

const config = {
    server: SERVER,
    mongo: MONGO,
};

module.exports = config;
