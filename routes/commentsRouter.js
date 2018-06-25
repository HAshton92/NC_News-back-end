const commentsRouter = require("express").Router();
const {
  voteOnComment,
  deleteComment
} = require("../controllers/commentsController");

commentsRouter
  .route("/:comment_id")
  .put(voteOnComment)
  .delete(deleteComment);

module.exports = commentsRouter;
