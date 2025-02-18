const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Accès refusé. Aucun token fourni." });
  }

  // ✅ Vérifie si le token commence bien par "Bearer "
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Format du token invalide. Utilisez 'Bearer token'." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Token décodé :", decoded); // Debugging

    if (!decoded.userId) {
      return res.status(401).json({ error: "Token invalide : userId non trouvé." });
    }

    req.userId = decoded.userId;
    req.username = decoded.username; // Ajoute username si nécessaire
    next();
  } catch (error) {
    console.error("🚨 Erreur lors de la vérification du token :", error);
    res.status(401).json({ error: "Token invalide ou expiré." });
  }
};

module.exports = verifyToken;