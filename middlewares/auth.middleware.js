const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ error: "Accès refusé. Aucun token fourni." });

  try {
    const token = authHeader.split(" ")[1]; // Vérifie si "Bearer" est bien présent
    if (!token) return res.status(401).json({ error: "Token non valide." });

    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded; // Stocke l'ID utilisateur
    next();
  } catch (error) {
    res.status(400).json({ error: "Token invalide." });
  }
};

module.exports = verifyToken;