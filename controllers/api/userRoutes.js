const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

// Get all users
router.get("/", async (req, res) => {
  await User.findAll({
    attributes: {
      exclude: ["password"],
    },
  })
    .then((UserData) => res.json(UserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Get specific user
router.get("/:id", async (req, res) => {
  await User.findOne({
    attributes: {
      exclude: ["password"],
    },
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "content", "created_at"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "created_at"],
        include: {
          model: Post,
          attributes: ["title"],
        },
      },
    ],
  })
    .then((UserData) => {
      if (!UserData) {
        res.status(404).json({
          message: "No user found with this id",
        });
        return;
      }
      res.json(UserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Create a user
router.post("/", async (req, res) => {
  await User.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  })
    .then((UserData) => {
      req.session.save(() => {
        req.session.user_id = UserData.id;
        req.session.username = UserData.username;
        req.session.email = UserData.email;
        req.session.loggedIn = true;

        res.json(UserData);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/login", async (req, res) => {
  await User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((UserData) => {
    if (!UserData) {
      res.status(400).json({
        message: "No user with that username!",
      });
      return;
    }

    const validPassword = UserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({
        message: "Incorrect password!",
      });
      return;
    }

    req.session.save(() => {
      req.session.user_id = UserData.id;
      req.session.username = UserData.username;
      req.session.loggedIn = true;

      res.json({
        user: UserData,
        message: "You are now logged in!",
      });
    });
  });
});

router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
