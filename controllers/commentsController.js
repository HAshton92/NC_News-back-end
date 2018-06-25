const { Comment, User } = require("../models/index");

const getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  Comment.find({ belongs_to: article_id })
    .then(comments => {
      comments.length
        ? res.send({ comments })
        : next({
            status: 404,
            msg: `No comments found for article ID '${article_id}'`
          });
    })
    .catch(next);
};

const addComment = (req, res, next) => {
  if (!("comment" in req.body && "created_by" in req.body))
    next({
      status: 400,
      msg: "Input must have keys of 'comment' and 'created_by'"
    });
  else {
    User.findOne({ username: req.body.created_by })
      .then(user => {
        user === null
          ? next({
              status: 400,
              msg: `No user found for id '${req.body.created_by}'`
            })
          : (req.body.created_by = user._id);
        const { article_id } = req.params;
        req.body.belongs_to = article_id;
        req.body.body = req.body.comment;
        const newComment = new Comment(req.body);
        return newComment.save().then(comment => {
          res.status(201).send({ comment });
        });
      })
      .catch(next);
  }
};

const voteOnComment = (req, res, next) => {
  const { vote } = req.query;
  if (vote !== "up" && vote !== "down")
    return next({
      status: 400,
      message: `Bad request; vote must be up or down, "${vote}" is invalid`
    });
  let change = 0;
  vote === "up" ? (change += 1) : (change += -1);
  const { comment_id } = req.params;
  Comment.findByIdAndUpdate(
    comment_id,
    { $inc: { votes: change } },
    { new: true }
  )
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  Comment.findByIdAndRemove(comment_id)
    .then(comment => {
      if (comment === null)
        next({
          status: 400,
          msg: `Bad request, could not find comment "${comment_id}`
        });
      res
        .status(202)
        .send({ msg: `Sucessfully deleted comment "${comment_id}"` });
    })
    .catch(next);
};

module.exports = {
  getCommentsByArticle,
  addComment,
  voteOnComment,
  deleteComment
};
