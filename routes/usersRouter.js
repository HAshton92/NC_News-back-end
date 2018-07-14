const usersRouter = require("express").Router();
const { addUser, getUserById } = require("../controllers/usersController");

usersRouter
  .route("/")
  .get(getUsers)
  .post(addUser);

usersRouter.route("/:user_id").get(getUserById);

module.exports = usersRouter;
