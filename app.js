
// Application utilisant le framework Express
// utilise mongoose pour la gestion de la base de données MongoDB

const express = require("express");
const app = express();
const helmet = require("helmet");
const mongoose = require("mongoose");

// Routeurs pour les "sauces" et les "utilisateurs"
const apiSauceRoutes = require("./routes/sauce");
const apiUserRoutes = require("./routes/user");
// importation de path pour accéder au path de notre serveur
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

// répond aux requêtes à /images en rendant notre dossier images statique 
app.use("/images", express.static(path.join(__dirname, "images")));

// transforme le corps de la requête en objet JSON
app.use(express.json());

/**Utilisation d'helmet qui va sécuriser les entêtes */
app.use(helmet());

/**Points d'accès de base pour les routes d'authentification */
app.use("/api/auth", apiUserRoutes);
/**Points d'accès de base pour les routes de gestion des sauces */
app.use("/api/sauces", apiSauceRoutes);

/**Configuration de cookie-parser */
app.use(cookieParser());

// exportation de l'application pour pouvoir y accéder depuis
// d'autres fichiers notamment le serveur node
module.exports = app;