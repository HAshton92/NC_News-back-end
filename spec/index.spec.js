process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest")(app);
const { expect } = require("chai");
const seedDB = require("../seed/seed");
const userData = require("../seed/testData/index");
const mongoose = require("mongoose");

describe("nc_news", () => {
  let commentDocs;
  let articleDocs;
  let userDocs;
  let topicDocs;
  beforeEach(() => {
    return seedDB(userData).then(docs => {
      [commentDocs, articleDocs, userDocs, topicDocs] = docs;
    });
  });
  after(() => {
    return mongoose.disconnect();
  });
  describe("/api/topics", () => {
    it("GET responds with status code 200 and an array of all the topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).to.equal(topicDocs.length);
          expect(topics[0]).to.include.keys("title", "slug");
        });
    });
  });
  describe("/api/topics/:topic_slug/articles", () => {
    it("GET respond with status code 200 and an array of articles which match the topic slug", () => {
      return request
        .get("/api/topics/mitch/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(2);
          expect(articles[0]).to.include.keys(
            "votes",
            "_id",
            "title",
            "created_by",
            "body",
            "belongs_to",
            "__v"
          );
        });
    });
    it("GET responds with status code 404 and a corresponding error message if no such genre exists", () => {
      return request
        .get("/api/topics/morph/articles")
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal(
            'No articles found for topic "morph"'
          );
        });
    });
  });
  describe("/api/articles", () => {
    it("GET responds with status code 200 and an array of all the articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(articleDocs.length);
          expect(articles[0]).to.include.keys(
            "title",
            "body",
            "belongs_to",
            "votes",
            "created_by"
          );
          expect(articleDocs[3]._id.equals(articles[3]._id));
        });
    });
  });
});
