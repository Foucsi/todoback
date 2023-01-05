var express = require("express");
var router = express.Router();
require("../models/connection");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

const User = require("../models/users");

/* GET users listing. */
router.get("/:token", function (req, res) {
  const token = req.params.token;
  User.findOne({ token })
    .then((users) => {
      if (!users) {
        res.status(404).json({ result: false });
      }
      res.json({ result: true, user: users });
    })
    .catch((err) => {
      res.status(500).json({ result: false, error: err });
    });
});

/* post a new user */

router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ username: req.body.username }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        token: uid2(32),
        tweets: [],
        favorites: [],
        photo: req.body.photo,
      });

      newUser.save().then((data) => {
        res.json({ result: true, user: data });
      });
    } else {
      res.json({ result: false, error: "User already exists" });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ username: req.body.username }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, user: data });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

/* route permettant de poster une photo */
router.post("/addPhoto/:token", (req, res) => {
  const token = req.params.token;
  const photo = req.body.photo;
  User.findOneAndUpdate({ token }, { $set: { photo: photo } })
    .then((data) => {
      if (!data) {
        res.status(404).json({ result: false, error: "User note found" });
      }
      res.json({ result: true, data: data });
    })
    .catch((err) => {
      res.status(500).json({ result: false, error: err });
    });
});

/* route pour recuperer la photo */
router.get("/photo/:token", (req, res) => {
  const token = req.params.token;
  User.findOne({ token }).then((data) => {
    res.json({ result: true, data: data.photo });
  });
});

module.exports = router;
