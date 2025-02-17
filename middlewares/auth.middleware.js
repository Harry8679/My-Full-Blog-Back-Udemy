const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  console.log("🔹 Header Authorization reçu :", authHeader); // Vérification du header reçu

  if (!authHeader) {
    return res.status(401).json({ error: "Accès refusé. Aucun token fourni." });
  }

  // Vérifier si le token contient "Bearer "
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  console.log("🔹 Token extrait :", token); // Vérification du token extrait

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Remplace par process.env.JWT_SECRET si tu veux sécuriser
    req.userId = decoded.userId;
    console.log("🔹 UserId extrait du token :", req.userId); // Vérifie si l'userId est bien extrait
    next();
  } catch (error) {
    console.error("Erreur lors de la vérification du token :", error);
    res.status(401).json({ error: "Token invalide ou expiré." });
  }
};

module.exports = verifyToken;
