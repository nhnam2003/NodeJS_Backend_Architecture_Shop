const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
var compression = require("compression");
var cors = require("cors");
require("dotenv").config();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// init db
require("./database/init.mongodb.js");


//cors
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
const { checkOverLoad } = require("./helper/check.connect.js");
checkOverLoad();
// init handle

app.use("/", require("../src/routes/index.js"));


//error routes
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});


// error handler middleware
app.use((error, req, res, next) => {
     console.error("Global error:", error); 
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
});

module.exports = app;
