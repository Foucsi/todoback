var express = require("express");
var router = express.Router();
require("../models/connection");

const User = require("../models/users");

router.post("/addFavorites/:token", (req, res) => {
  const token = req.params.token;
  const favorites = req.body.favorites;
  User.findOneAndUpdate(
    { token },
    {
      $push: { favorites: { favorites } },
    }
  )
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

router.delete("/removeFavorites/:token", (req, res) => {
  const token = req.params.token;

  const favorites = req.body.favorites;
  User.findOneAndUpdate(
    { token },
    {
      $pull: { favorites: { favorites } },
    }
  )
    .then((data) => {
      if (!data) {
        res.status(404).json({ result: false, error: "User not found" });
      }
      res.json({ result: true, data: data });
    })
    .catch((err) => {
      res.status(500).json({ result: false, error: err });
    });
});

module.exports = router;
