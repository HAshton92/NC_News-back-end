const seedDB = require("./seed");
const mongoose = require("mongoose");
const rawData = require("./devData/index");
const { DB_URL } = require("../config/index");

mongoose
  .connect(DB_URL)
  .then(() => {
    return seedDB(rawData);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .then(() => {
    console.log(`successfully disconnected from ${DB_URL}...`);
  })
  .catch(console.log);
