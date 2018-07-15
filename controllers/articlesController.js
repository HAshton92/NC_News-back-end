const { Article, User } = require("../models/index");

const getArticles = (req, res, next) => {
  Article.find()
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  Article.findById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const voteOnArticle = (req, res, next) => {
  const { vote } = req.query;
  if (vote !== "up" && vote !== "down")
    return next({
      status: 400,
      msg: `Bad request; vote must be up or down, "${vote}" is invalid`
    });
  let change = 0;
  vote === "up" ? (change += 1) : (change += -1);
  const { article_id } = req.params;
  Article.findByIdAndUpdate(
    article_id,
    { $inc: { votes: change } },
    { new: true }
  )
    .then(article => {
      if (article === null) {
        return next({
          status: 400,
          msg: `Bad request : ${article_id} is not a valid ID`
        });
      }
      res.status(201).send({ article });
    })
    .catch(next);
};

const getArticlesByTopic = (req, res, next) => {
  const { topic_slug } = req.params;
  Article.find({ belongs_to: topic_slug })
    .then(articles => {
      articles.length
        ? res.status(200).send({ articles })
        : next({
            status: 404,
            msg: `No articles found for topic \"${topic_slug}\"`
          });
    })
    .catch(next);
};

const addArticleToTopic = (req, res, next) => {
  if (!("title" in req.body && "body" in req.body && "created_by" in req.body))
    next({
      status: 400,
      msg: "Input must have keys of 'title', 'body', and 'created_by'"
    });
  else {
    User.findOne({ username: req.body.created_by }).then(user => {
      user === null
        ? next({
            status: 400,
            msg: `No user found for username "${req.body.created_by}"`
          })
        : (req.body.created_by = user._id);
      const { topic_slug } = req.params;
      req.body.belongs_to = topic_slug;
      const newArticle = new Article(req.body);
      return newArticle
        .save()
        .then(article => {
          res.status(201).send({ article });
        })
        .catch(next);
    });
  }
};

module.exports = {
  getArticles,
  getArticleById,
  voteOnArticle,
  getArticlesByTopic,
  addArticleToTopic
};
