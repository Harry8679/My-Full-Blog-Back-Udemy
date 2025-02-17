const express = require("express");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/auth.middleware");

const router = express.Router();

// Inscription
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Utilisateur créé avec succès !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const token = jwt.sign({ userId: user._id }, "SECRET_KEY", { expiresIn: "1h" });
    res.json({ token, userId: user._id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Déconnexion
router.post("/logout", (req, res) => {
  res.json({ message: "Déconnexion réussie" });
});

// Récupération du profil utilisateur
router.get("/profile", verifyToken, async (req, res) => {
  try {
    console.log("🔹 Token reçu :", req.header("Authorization")); // Vérifie si le token est bien reçu
    console.log("🔹 UserId extrait du token :", req.userId); // Vérifie si le userId est bien extrait

    if (!req.userId) {
      return res.status(401).json({ error: "Accès refusé. Token invalide ou expiré." });
    }

    const user = await User.findById(req.userId).select("username email");
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.json({ user });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
// router.get("/profile", verifyToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select("username email");
//     if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

//     res.json({ user });
//   } catch (error) {
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// });

module.exports = router;