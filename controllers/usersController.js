const User = require("../models/index");

const getUsers = (req, res, next) => {
  User.find()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

const addUser = (req, res, next) => {
  const user = new User(req.body);
  user
    .save()
    .then(userDoc => {
      res.status(201).send({ user: userDoc });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { user_id } = req.params;
  User.findById(user_id)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = { addUser, getUserById, getUsers };
