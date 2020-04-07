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
  if (req.body.text && req.body.post_id) {
    database
      .findById(req.params.id)
      .then((post) => {
        console.log(post);
        post.length
          ? database
              .insertComment(req.body)
              .then((comment) => {
                res.status(201).json(comment);
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error:
                    "There was an error while saving the comment to the database.",
                });
              })
          : res.status(404).json({
              message: "The post with the specified id does not exist.",
            });
      })
      .catch((err) => {
        res.status(500).json({ message: "The post could not be created." });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }
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
      if (post && req.body.title && req.body.contents) {
        database
          .findById(req.params.id)
          .then((update) => res.status(200).json(update));
      } else if (!req.body.title || !req.body.contents) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post.",
        });
      } else {
        res.status(404).json({
          error: "The post with the specified ID could not be found.",
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

// router.put("/:id", (req, res) => {
//   database
//     .update(req.params.id, req.body)
//     .then((post) => {
//       database
//         .findById(req.params.id)
//         .then((post) => {
//           res.status(200).json(post);
//         })
//         .catch((err) => {
//           res.status(500).json({ error: "error reading the updated post" });
//         });
//       if (post) {
//         res.status(200).json(post);
//       } else {
//         res.status(404).json({ error: "The post could not be found." });
//       }
//     })
//     .catch((err) => {
//       res
//         .status(500)
//         .json({ error: "The post information could not be modified." });
//     });
// });

module.exports = router;
