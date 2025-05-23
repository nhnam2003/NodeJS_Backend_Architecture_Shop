const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
var compression = require("compression");

// init middleware
app.use(morgan("dev"));
app.use(helmet());
// app.use(compression())

// init db

// init handle

app.get("/", (req, res) => {
  const hl  = "Hello World!";
  res.status(200).json({
    message : hl,
    metadata:hl.repeat(100)
  })
});

module.exports = app;
