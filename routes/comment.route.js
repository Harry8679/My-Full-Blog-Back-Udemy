const express = require("express");
const Comment = require("../models/comment.model");
const router = express.Router();

router.post("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { userId, content } = req.body;

  try {
    const newComment = new Comment({ postId, userId, content });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ postId });
  res.json(comments);
});

module.exports = router;