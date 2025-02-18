const express = require("express");
const Comment = require("../models/comment.model");
const router = express.Router();

router.post("/:postId", verifyToken, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId; // 🔥 Extraction de l'ID utilisateur

  if (!userId) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }

  try {
    const newComment = new Comment({ postId, userId, content });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
    res.status(500).json({ error: "Erreur serveur lors de l'ajout du commentaire" });
  }
});
// router.post("/:postId", async (req, res) => {
//   const { postId } = req.params;
//   const { userId, content } = req.body;

//   try {
//     const newComment = new Comment({ postId, userId, content });
//     await newComment.save();
//     res.status(201).json(newComment);
//   } catch (error) {
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// });

router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ postId });
  res.json(comments);
});

module.exports = router;