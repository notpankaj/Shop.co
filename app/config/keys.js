const cnf = require("dotenv").config;
cnf();

const SERVER_PORT = process.env.PORT
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME
const MONGO_DB_URL = process.env.MONGO_DB_URL || `mongodb://localhost:27017/`
const SALT = process.env.SALT
const SECRET = process.env.SECRET


const KEYS = {
    MONGO_DB_URL, SERVER_HOSTNAME, SERVER_PORT, SALT, SECRET
}

module.exports = KEYS