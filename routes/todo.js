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
