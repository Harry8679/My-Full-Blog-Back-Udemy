const express = require("express");
const Post = require("../models/post.model");

const router = express.Router();

// 📝 Créer un article
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 📖 Obtenir tous les articles
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username");
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 📝 Mettre à jour un article
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🗑 Supprimer un article
router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json("Article supprimé");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;