const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById
} = require("../controllers/articlesController");
const {
  getCommentsByArticle,
  addComment
} = require("../controllers/commentsController");

articlesRouter.route("/").get(getArticles);

articlesRouter.route("/:article_id").get(getArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(addComment);

module.exports = articlesRouter;
