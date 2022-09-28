const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

//find all post belong to the user
router.get("/", withAuth, async (req, res) => {
  await Post.findAll({
    where: {
      user_id: req.session.user_id,
    },
    attributes: ["id", "title", "content", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((PostData) => {
      const profile = PostData.map((data) =>
        data.get({
          plain: true,
        })
      );
      res.render("dashboard", {
        profile,
        loggedIn: true,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//single post
router.get("/edit/:id", withAuth, async (req, res) => {
  await Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "content", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
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

      const post = PostData.get({
        plain: true,
      });

      res.render("postEdit", {
        post,
        loggedIn: true,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//add a post
router.get("/new", (req, res) => {
  res.render("postAdd", {
    loggedIn: true,
  });
});

module.exports = router;
