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

this responds with a status code of 201 and an object showing the article you have just entered, with a property "belongs_to" matching the topic slug in the URL.

```http
GET /api/articles
```

Responds with a status code of 200 and serves an array of all the articles contained in the database.

```http
PUT /api/comments/:comment_id?vote=up/down
```

Responds with a status code of 201 and and object for the corresponding article, showing the votes have been incremented or decremented by 1, depending on the URL query.

#### Error handling

Unrecognised URL inputs respond with a status code of 404 and serves a message to state the page wasn't found.

Bad requests respond with a status code of 400 and a message to state why the input is not valid.

Internal server errors respond with a status code of 500 and a message to state an internal server error has occured.
