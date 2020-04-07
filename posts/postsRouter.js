const express = require("express");

const database = require("../data/db");

const router = express.Router();

router.get("/", (req, res) => {
  database
    .find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({
        error: "There was an error retrieving data from the database",
      });
    });
});

module.exports = router;
