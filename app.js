const express = require("express");
const app = express();
const mongoose = require("mongoose");
const apiSauceRoutes = require("./routes/sauce");
const apiUserRoutes = require("./routes/user");
const path = require("path");

/**Connexion de l'API à la base de données MongoDB */
mongoose.connect("mongodb+srv://Piiquante_API:pyzMrvQgGdjHgziB@cluster0.2ol13jn.mongodb.net/?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connexion à MongDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

/**Pour mettre en place CORS et permettre à des requêtes de partout d'arriver sur notre API*/
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/**Middleware pour extraire le corps JSON afin de gérer la requête post */
app.use(express.json());

app.use("/api/sauces", apiSauceRoutes);
app.use("/api/auth", apiUserRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;