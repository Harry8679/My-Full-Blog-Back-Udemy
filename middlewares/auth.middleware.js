const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Accès refusé. Aucun token fourni." });

  try {
    const decoded = jwt.verify(token.split(" ")[1], "SECRET_KEY");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json({ error: "Token invalide." });
  }
};

module.exports = verifyToken;