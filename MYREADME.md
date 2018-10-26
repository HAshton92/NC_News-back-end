## Northcoders News - back end

Northcoders News is a social news aggregation, web content rating, and discussion website. Think something along the lines of [Reddit](https://www.reddit.com/).

Northcoders News has articles which are divided into topics. Each article has user curated ratings and can be up or down voted using the API. Users can also add comments about an article. Comments can also be up or down voted. A user can add comments and remove any comments which they have added.

This is the back end of the project, built using Express and mongoDB. The following dependencies are required to run the project

    body-parser: ^1.15.2,
    cors: ^2.8.4,
    ejs: ^2.6.1,
    express: ^4.16.3,
    mongoose: ^5.1.6

[The final product is deployed on Heroku here.](https://nc-news-by-howard.herokuapp.com/)

This back end is utilised by the front end of the project [which is hosted on Heroku here](https://nc-news-by-howard-frontend.herokuapp.com/) and on [Github here.](http://github.com/HAshton92/NC_News-Front-End)

#### Routes

```http
GET /api/topics
```

Responds with a status code of 200 and serves an array of all the topics contained in the database.

```http
GET /api/topics/:topics_slug/articles
```

If a valid topic slug is entered, this responds with a status code of 200 and an array of all the articles which match the slug.

```http
POST /api/topics/:topics_slug/articles
```

If a valid article is added in the following format:

{ title: "string", body: "string", created_by: "string, must match a valid username" }

This responds with a status code of 201 and an object showing the article you have just entered, with a property "belongs_to" matching the topic slug in the URL.

```http
GET /api/articles
```

Responds with a status code of 200 and serves an array of all the articles contained in the database.

```http
GET /api/articles/:article_id
```

If a valid article id is entered, this responds with a status code of 200 and an object containing the corresponding article.

```http
PUT /api/articles/:article_id?vote=up/down
```

Responds with a status code of 201 and and object for the corresponding article, showing the votes have been incremented or decremented by 1, depending on the URL query.

```http
GET /api/articles/:article_id/comments
```

If comments exist for the article, this will respond with a status code of 200, and an array of the comments.

```http
POST /api/articles/:article_id/comments
```

If a valid comment is added in the following format:

{ comment: "string", created_by: "string, must match a valid username" }

This responds with a status code of 201 and an object showing the comment you have just entered, with a property "belongs_to" matching the article id in the URL.

```http
PUT /api/comments/:comment_id?vote=up/down
```

Responds with a status code of 201 and and object for the corresponding comment, showing the votes have been incremented or decremented by 1, depending on the URL query.

```http
DELETE /api/comments/:comment_id
```

Responds with a status code of 202 and a message stating that the corresponding comment has been successfully deleted.

```http
GET /api/users
```

Responds with a status code of 200 and serves an array of all the users contained in the database.

```http
GET /api/users/:user_id
```

If a valid user id is entered, this responds with a status code of 200 and an object containing the corresponding user.

#### Error handling

Unrecognised URL inputs respond with a status code of 404 and serves a message to state the page wasn't found.

Bad requests respond with a status code of 400 and a message to state why the input is not valid.

Internal server errors respond with a status code of 500 and a message to state an internal server error has occured.

#### Testing

All the routes are fully tested using Chai and Supertest. This can be seen in the spec folder, or using the `npm test` command after forking and cloning this repo.
