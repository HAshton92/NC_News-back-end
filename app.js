const express = require("express");
const mongoose = require("mongoose");
const apiRouter = require("./routes/api");
const bodyParser = require("body-parser");
const app = express();
const { DB_URL } = require("./config");
mongoose.connect(DB_URL).then(() => {
  console.log(`connected to the ${DB_URL}...`);
});

app.use(bodyParser.json());

app.get("/", (req, res, next) => res.status(200).send("Welcome to NC News"));

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
  next({ status: 404, msg: "page not found" });
});

app.use((err, req, res, next) => {
  console.log(err, "<<<<ERROR<<<<");
  if (err.name === "CastError")
    res
      .status(400)
      .send({ msg: `Bad request : ${err.value} is not a valid ID` });
  else if (err.name === "ValidationError")
    res.status(400).send({ msg: `Bad request : ${err.msg}` });
  else if (err.status) res.status(err.status).send({ message: err.msg });
  else res.status(500).send({ message: "Internal server error" });
});

module.exports = app;
