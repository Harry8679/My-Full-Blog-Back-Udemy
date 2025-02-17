const express = require("express");
const Post = require("../models/post.model");
const verifyToken = require("../middlewares/auth.middleware");

const router = express.Router();

// 📝 Créer un article (avec auteur)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content, image } = req.body;
    
    if (!req.userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const newPost = new Post({ title, content, image, author: req.userId }); // ✅ Correction ici
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Erreur lors de la création de l'article :", err);
    res.status(500).json({ error: "Erreur lors de la création de l'article" });
  }
});

// router.post("/", verifyToken, async (req, res) => {
//   try {
//     const { title, content, image } = req.body;
//     const newPost = new Post({ title, content, image, author: req.user.userId });
//     const savedPost = await newPost.save();
//     res.status(201).json(savedPost);
//   } catch (err) {
//     res.status(500).json({ error: "Erreur lors de la création de l'article" });
//   }
// });

// 📖 Obtenir tous les articles (avec auteur)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des articles" });
  }
});

// 👍 Ajouter ou retirer un like
router.post("/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Article non trouvé" });

    const userId = req.user.userId;
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ message: "Like mis à jour", likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du like" });
  }
});

module.exports = router;