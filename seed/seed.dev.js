const seedDB = require("./seed");
const mongoose = require("mongoose");
const rawData = require("./devData/index");
const { DB_URL } = require("../config/index");
console.log(DB_URL);

mongoose
  .connect(DB_URL)
  .then(() => {
    return seedDB(rawData);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .then(() => {
    console.log(`successfully seeded mongo db: "${DB_URL}" and disconnected`);
  })
  .catch(console.log);
