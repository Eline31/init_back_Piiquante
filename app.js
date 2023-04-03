const express = require("express");
const app = express();
const helmet = require("helmet");
const mongoose = require("mongoose");
const apiSauceRoutes = require("./routes/sauce");
const apiUserRoutes = require("./routes/user");
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");

/**Connexion de l'API à la base de données MongoDB */
mongoose.connect(process.env.SECRET_DB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connexion à MongDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

/****************ROUTES DE BASE CONCERNANT TOUTE REQUÊTE */
/**Pour mettre en place CORS et permettre à des requêtes de partout d'arriver sur notre API*/
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/**Ajout du chemin statique à l'application pour servir les images */
app.use("/images", express.static(path.join(__dirname, "images")));

/**Middleware pour extraire le corps JSON afin de gérer la requête post */
app.use(express.json());

/**Utilisation d'helmet qui va créer des headers pour sécuriser l'application */
app.use(helmet());

/**Points d'accès de base pour les routes d'authentification */
app.use("/api/auth", apiUserRoutes);
/**Points d'accès de base pour les routes de gestion des sauces */
app.use("/api/sauces", apiSauceRoutes);

/**Configuration de cookie-parser */
app.use(cookieParser());

module.exports = app;