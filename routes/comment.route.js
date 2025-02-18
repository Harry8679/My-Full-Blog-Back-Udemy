const express = require("express");
const Comment = require("../models/comment.model");
const verifyToken = require("../middlewares/auth.middleware"); // 🔥 Ajout du middleware d'auth

const router = express.Router();

// 🔥 Route protégée pour ajouter un commentaire
router.post("/:postId", verifyToken, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié." });
    }

    const newComment = new Comment({ postId, userId: req.userId, content });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error("🚨 Erreur lors de l'ajout du commentaire :", error);
    res.status(500).json({ error: "Erreur serveur lors de l'ajout du commentaire" });
  }
});

// 📌 Récupérer les commentaires d’un post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).populate("userId", "username");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des commentaires" });
  }
});

module.exports = router;