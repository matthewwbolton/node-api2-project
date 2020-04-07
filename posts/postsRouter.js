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
        error: "The posts information could not be retrieved.",
      });
    });
});

router.get("/:id", (req, res) => {
  database
    .findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ error: "The post with the specified ID does not exist." });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  database
    .findPostComments(req.params.id)
    .then((comments) => {
      if (comments) {
        res.status(200).json(comments);
      } else {
        res
          .status(500)
          .json({ error: "The comments information could not be retrieved." });
      }
    })
    .catch((err) => {
      res
        .status(404)
        .json({ error: "The post with the specified ID does not exist." });
    });
});

router.post("/", (req, res) => {
  database
    .insert(req.body)
    .then((post) => {
      if (req.body.title && req.body.contents) {
        res.status(201).json(post);
      } else {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "There was an error while saving the post to the database.",
      });
    });
});

router.post("/:id/comments", (req, res) => {
  database
    .findById(req.params.id)
    .then((post) => {
      database
        .insertComment(req.body)
        .then((comment) => {
          if (req.body.text) {
            res.status(201).json(post);
          } else {
            res
              .status(400)
              .json({ errorMessage: "Please provide text for the comment." });
          }
        })
        .catch((err) => {
          res.status(500).json({
            error:
              "There was an error while saving the comment to the database.",
          });
        });
    })
    .catch((err) => {
      res
        .status(404)
        .json({ message: "The post with the specified id does not exist." });
    });
});

router.delete("/:id", (req, res) => {
  database
    .remove(req.params.id)
    .then((post) => {
      if (post) {
        res.status(204).json(post);
      } else {
        res
          .status(404)
          .json({ error: "The post with the specified ID does not exist" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "The post could not be removed." });
    });
});

router.put("/:id", (req, res) => {
  database
    .update(req.params.id, req.body)
    .then((post) => {
      if (req.body.title && req.body.contents) {
        res.status(200).json(post);
      } else if (!req.body.title || !req.body.contents) {
        res
          .status(400)
          .json({
            errorMessage: "Please provide title and contents for the post.",
          });
      } else {
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
      }
    })
    .catch((err) => {
      res
        .status(404)
        .json({ error: "The post with the specified ID does not exist." });
    });
});

module.exports = router;
