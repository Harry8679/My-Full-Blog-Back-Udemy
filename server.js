const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.route");
const postRoutes = require("./routes/post.route");
const commentRoutes = require('./routes/comment.route');

dotenv.config();
const app = express();

// ✅ Configuration CORS pour autoriser ton frontend
const corsOptions = {
  origin: "http://localhost:3000", // Remplace par l'URL de ton frontend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Autorise l'envoi des cookies et headers sécurisés
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); // Appliquer CORS avec les options

// Middlewares
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 4400;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
