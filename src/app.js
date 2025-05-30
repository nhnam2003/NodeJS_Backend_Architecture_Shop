const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
var compression = require("compression");

require("dotenv").config();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// init db
require("./database/init.mongodb.js");

const { checkOverLoad } = require("./helper/check.connect.js");
checkOverLoad();
// init handle

app.use("/", require("../src/routes/index.js"));

module.exports = app;
