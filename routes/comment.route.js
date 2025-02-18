const express = require("express");
const Comment = require("../models/comment.model");
const verifyToken = require("../middlewares/auth.middleware");

const router = express.Router();

// 📝 Ajouter un commentaire
router.post("/:postId", verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.userId;

    const newComment = new Comment({ postId: req.params.postId, userId, content });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur lors de l'ajout du commentaire" });
  }
});

// 📖 Obtenir tous les commentaires d'un post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).populate("userId", "username");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur lors de la récupération des commentaires" });
  }
});

module.exports = router;