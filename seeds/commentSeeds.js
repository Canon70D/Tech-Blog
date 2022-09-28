const { Comment } = require("../models");

const commentSeed = async (userId, postIds) => {
  const comments = [
    {
      comment_text: "A test comment",
      user_id: userId,
      post_id: postIds[Math.floor(Math.random() * postIds.length)],
    },
    {
      comment_text: "Another test comment",
      user_id: userId,
      post_id: postIds[Math.floor(Math.random() * postIds.length)],
    },
    {
      comment_text: "Third test comment",
      user_id: userId,
      post_id: postIds[Math.floor(Math.random() * postIds.length)],
    },
  ];

  await Comment.bulkCreate(comments);
};

module.exports = commentSeed;
