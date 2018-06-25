const mongoose = require("mongoose");
const { User, Article, Comment, Topic } = require("../models/index");
const { formatArticleData, formatCommentData } = require("../utils/index");

const seedDB = ({ userData, topicData, articleData, commentData }) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([
        User.insertMany(userData),
        Topic.insertMany(topicData)
      ]);
    })
    .then(([userDocs, topicDocs]) => {
      return Promise.all([
        Article.insertMany(formatArticleData(articleData, userDocs)),
        userDocs,
        topicDocs
      ]);
    })
    .then(([articleDocs, userDocs, topicDocs]) => {
      return Promise.all([
        Comment.insertMany(
          formatCommentData(commentData, articleDocs, userDocs)
        ),
        articleDocs,
        userDocs,
        topicDocs
      ]);
    })
    .catch(console.log);
};

module.exports = seedDB;
