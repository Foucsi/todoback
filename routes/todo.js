var express = require("express");
var router = express.Router();
require("../models/connection");

const User = require("../models/users");

/*Récupere le nombre de todo par utilisateur avec parametre token */

router.get("/numberTodo/:token", (req, res) => {
  const token = req.params.token;
  User.findOne({ token }).then((data) => {
    res.json({ result: true, data: data.todo.length });
  });
});

/* recupere le nombre d'element en favorites */

router.get("/numberFavorites/:token", (req, res) => {
  const token = req.params.token;
  User.findOne({ token }).then((data) => {
    res.json({ result: true, data: data.favorites.length });
  });
});
/* Récupere l'ensemble des favoris par utilisateur */
router.get("/allFavorites/:token", (req, res) => {
  const token = req.params.token;
  User.findOne({ token }).then((data) => {
    res.json({ result: true, data: data.favorites });
  });
});

/* route permettant de supprimer des favorites */

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

/* ajoute un nouveau tweet au sous document todo avec le parametre token */
router.post("/addTodo/:token", (req, res) => {
  const token = req.params.token;
  const todo = req.body.todo;
  User.findOneAndUpdate(
    { token },
    {
      $push: { todo: { todo } },
    }
  )
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .json({ result: false, error: "User not found!" });
      }
      res.json({ result: true });
    })
    .catch((err) => {
      res.status(500).json({ result: false, error: err });
    });
});

router.delete("/removeTodo/:token", (req, res) => {
  const token = req.params.token;
  const todo = req.body.todo;
  User.findOneAndUpdate(
    { token },
    {
      $pull: { todo: { todo } },
    }
  )
    .then((data) => {
      if (!data) {
        return res.status(404).json({ result: false, error: "User not found" });
      }
      res.json({ result: true, data: data.todo });
    })
    .catch((err) => {
      res.status(500).json({ result: false, error: err });
    });
});

module.exports = router;
