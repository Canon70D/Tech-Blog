const { Post } = require("../models");

const seedPost = async (userId) => {
  const posts = [
    {
      title: "Test Post 1",
      user_id: userId,
      content: "A test post see if this was seeded",
    },
    {
      title: "Test Post 2 ",
      user_id: userId,
      content: "Another test post",
    },
    {
      title: "Test Post 3",
      user_id: userId,
      content: "A third one",
    },
  ];

  const postModels = await Post.bulkCreate(posts);
  return postModels.map((model) => model.id);
};

module.exports = seedPost;
