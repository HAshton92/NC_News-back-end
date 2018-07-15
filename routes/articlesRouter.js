const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  voteOnArticle
} = require("../controllers/articlesController");
const {
  getCommentsByArticle,
  addComment
} = require("../controllers/commentsController");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .put(voteOnArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(addComment);

module.exports = articlesRouter;
