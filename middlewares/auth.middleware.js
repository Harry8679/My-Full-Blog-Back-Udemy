const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Accès refusé. Aucun token fourni." });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Token décodé :", decoded); // ✅ Debugging

    req.userId = decoded.userId;
    req.username = decoded.username;

    if (!req.userId) {
      return res.status(401).json({ error: "Token invalide : userId non trouvé." });
    }

    next();
  } catch (error) {
    console.error("🚨 Erreur lors de la vérification du token :", error);
    res.status(401).json({ error: "Token invalide ou expiré." });
  }
};

module.exports = verifyToken;