const middleware = require("./utils/middleware");
const blogRouter = require("./controllers/blog");
const config = require("./utils/config");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(middleware.reqLogger);
app.use(express.static("build"));

mongoose
  .connect(config.MONGO_URL)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log("could not connect :", err.message);
  });

app.use("/api/blogs", blogRouter);
app.use(middleware.errHandler);

module.exports = app;
