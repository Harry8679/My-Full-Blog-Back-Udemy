const express = require("express");
const Post = require("../models/post.model");
const verifyToken = require("../middlewares/auth.middleware");

const router = express.Router();

// 📝 Créer un article
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content, image } = req.body;

    const newPost = new Post({ title, content, image, author: req.user.userId });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la création de l'article" });
  }
});

// 📖 Obtenir tous les articles
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des articles" });
  }
});

// 📖 Obtenir un article par son ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username");
    if (!post) return res.status(404).json({ error: "Article non trouvé" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération de l'article" });
  }
});

// 👍 Ajouter ou retirer un like
// 🔥 Route protégée : Ajouter ou retirer un like
router.post("/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Article non trouvé" });

    const userId = req.userId; // ✅ Maintenant, userId vient du middleware
    if (!userId) return res.status(401).json({ error: "Utilisateur non authentifié" });

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ message: "Like mis à jour", likes: post.likes.length });
  } catch (err) {
    console.error("🚨 Erreur lors du like :", err);
    res.status(500).json({ error: "Erreur serveur lors du like" });
  }
});

module.exports = router;
