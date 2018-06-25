const { Topic } = require("../models/index");

const getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next);
};

module.exports = { getTopics };
