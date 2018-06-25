const changeToId = (name, key, lookup) => {
  const index = lookup.findIndex(entry => entry[key] === name);
  return lookup[index]._id;
};

const formatArticleData = (articleData, userLookup) => {
  return articleData.map(articleDatum => {
    const { topic: belongs_to, created_by } = articleDatum;
    return {
      ...articleDatum,
      belongs_to,
      votes: 0,
      created_by: changeToId(created_by, "username", userLookup)
    };
  });
};

const formatCommentData = (commentData, articleLookup, userLookup) => {
  return commentData.map(commentDatum => {
    const { belongs_to, created_by } = commentDatum;
    return {
      ...commentDatum,
      belongs_to: changeToId(belongs_to, "title", articleLookup),
      created_by: changeToId(created_by, "username", userLookup)
    };
  });
};

module.exports = { formatArticleData, formatCommentData };
