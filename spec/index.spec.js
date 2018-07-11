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
    it("POST with a valid JSON input responds with a status code 201 and a JSON object of the entered article", () => {
      return request
        .post("/api/topics/mitch/articles")
        .send({
          title: "Test title",
          body: "Body of test article",
          created_by: "butter_bridge"
        })
        .expect(201)
        .then(res => {
          expect(({ body: { article } }) => {
            expect(article).to.include.keys(
              "votes",
              "_id",
              "title",
              "created_by",
              "body",
              "belongs_to",
              "__v"
            );
            expect(article.belongs_to).to.equal("mitch");
            expect(article.created_by).to.be.a("string");
          });
        });
    });
    it("POST responds with status code of 400 and a relevant error message if the correct keys are not included in the input object", () => {
      return request
        .post("/api/topics/mitch/articles")
        .send({
          title: "Test title",
          created_by: "butter_bridge"
        })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            "Input must have keys of 'title', 'body', and 'created_by'"
          );
        });
    });
    it("POST responds with status code of 400 and a relevant error message if a non-existant username is entered", () => {
      return request
        .post("/api/topics/mitch/articles")
        .send({
          title: "Test title",
          body: "Body of test article",
          created_by: "claude_rains"
        })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            'No user found for username "claude_rains"'
          );
        });
    });
  });
  describe("/api/articles", () => {
    it("GET responds with status code of 200 and an array of all the articles", () => {
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
  describe.only("/api/comments/:comment_id", () => {
    it("PUT responds with a status code of 201 and a comment object with a changed vote", () => {
      return request
        .put(`/api/comments/${commentDocs[0]._id}?vote=up`)
        .expect(201)
        .then(res => {
          expect(res.body.comment.votes).to.equal(8);
        });
    });
    it("PUT responds with a status code of 400 and a corresponding error message if the URL query doesn't match either 'up or 'down'", () => {
      return request
        .put(`/api/comments/${commentDocs[0]._id}?vote=banana`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            'Bad request; vote must be up or down, "banana" is invalid'
          );
        });
    });
    it("PUT responds with a status code of 400 and a corresponding error message if a nonexistant comment id is entered", () => {
      return request
        .put(`/api/comments/${userDocs[0]._id}?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            `Bad request : ${userDocs[0]._id} is not a valid ID`
          );
        });
    });
    it("DELETE responds with a status code of 202 and message to confirm deletion", () => {
      return request
        .delete(`/api/comments/${commentDocs[0]._id}`)
        .expect(202)
        .then(res => {
          expect(res.body.msg).to.equal(
            `Sucessfully deleted comment "${commentDocs[0]._id}"`
          );
        });
    });
    it("DELETE responds with a status code 404 and a message saying the page was not found when passed a nonexistant id", () => {
      return request
        .delete(`/api/comments/${userDocs[0]._id}`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            `Bad request, could not find comment "${userDocs[0]._id}`
          );
        });
    });
  });
});
