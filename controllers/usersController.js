const User = require("../models/index");

const addUser = (req, res, next) => {
  const user = new User(req.body);
  user
    .save()
    .then(userDoc => {
      res.status(201).send({ user: userDoc });
    })
    .catch(next);
};

module.exports = { addUser };
