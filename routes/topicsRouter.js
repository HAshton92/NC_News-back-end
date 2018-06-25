const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topicsController");
const {
  getArticlesByTopic,
  addArticleToTopic
} = require("../controllers/articlesController");

topicsRouter.route("/").get(getTopics);

topicsRouter
  .route("/:topic_slug/articles")
  .get(getArticlesByTopic)
  .post(addArticleToTopic);

module.exports = topicsRouter;
