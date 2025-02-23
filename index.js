const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { loggerUtil } = require("./app/utils/Logger.util");
const app = express();
const routes = require("./app/routes");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "100mb" }));

const uploadDir = path.join(__dirname, "app/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Routes for the app
routes(app);

// Application configurations that use environmental variables (env)
const config = require("./app/config/");

// Loading APP Variables
const DB_URL = config.mongo.string;
const DB_NAME = config.mongo.database;
const PORT = config.server.port;

// Initializing DB connection
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_URL, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      loggerUtil(`Server running on port: ${PORT}`);
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((error) => loggerUtil(`Error :- ${error.message} `));
