const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// Get all posts
router.get("/", async (req, res) => {
  await Post.findAll({
    attributes: ["id", "content", "title", "created_at"],
    order: [["created_at", "DESC"]],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    .then((PostData) => res.json(PostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Get a single post
router.get("/:id", async (req, res) => {
  await Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "content", "title", "created_at"],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    .then((PostData) => {
      if (!PostData) {
        res.status(404).json({
          message: "No post found with this id",
        });
        return;
      }
      res.json(PostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Create a post
router.post("/", withAuth, async (req, res) => {
  console.log("creating");
  await Post.create({
    title: req.body.title,
    content: req.body.post_content,
    user_id: req.session.user_id,
  })
    .then((PostData) => res.json(PostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Update a post
router.put("/:id", withAuth, async (req, res) => {
  await Post.update(
    {
      title: req.body.title,
      content: req.body.post_content,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((PostData) => {
      if (!PostData) {
        res.status(404).json({
          message: "No post found with this id",
        });
        return;
      }
      res.json(PostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Delete a post
router.delete("/:id", withAuth, async (req, res) => {
  await Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((PostData) => {
      if (!PostData) {
        res.status(404).json({
          message: "No post found with this id",
        });
        return;
      }
      res.json(PostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
