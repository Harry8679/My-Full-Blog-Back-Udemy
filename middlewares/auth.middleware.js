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
    console.log("🔹 Contenu décodé du token :", decoded); // 🔥 Debugging

    req.userId = decoded.userId || decoded._id; // ✅ Vérifie les deux possibilités
    req.username = decoded.username; // ✅ Stocke aussi l'username (optionnel)

    if (!req.userId) {
      return res.status(401).json({ error: "Token invalide : userId non trouvé." });
    }

    next();
  } catch (error) {
    console.error("🚨 Erreur lors de la vérification du token :", error);
    res.status(401).json({ error: "Token invalide ou expiré." });
  }
};

// const verifyToken = (req, res, next) => {
//   const authHeader = req.header("Authorization");

//   console.log("🔹 Header Authorization reçu :", authHeader); // Vérification du header reçu

//   if (!authHeader) {
//     return res.status(401).json({ error: "Accès refusé. Aucun token fourni." });
//   }

//   // Vérifier si le token contient "Bearer "
//   const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

//   console.log("🔹 Token extrait :", token); // Vérification du token extrait

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); 
//     console.log("🔹 Contenu décodé du token :", decoded); // 🔥 Vérification complète

//     // Vérification de l'existence de l'ID utilisateur
//     req.userId = decoded.userId || decoded.id || decoded._id; // ✅ Récupérer le bon champ
//     if (!req.userId) {
//       return res.status(401).json({ error: "Token invalide : userId non trouvé." });
//     }

//     console.log("🔹 UserId extrait du token :", req.userId); // Vérifie si l'userId est bien extrait
//     next();
//   } catch (error) {
//     console.error("🚨 Erreur lors de la vérification du token :", error);
//     res.status(401).json({ error: "Token invalide ou expiré." });
//   }
// };

module.exports = verifyToken;