const mongoose = require("mongoose");

/**Création d'un schéma de données contenant les champs souhaités */
const userSchema = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

/**On exporte le schéma en tant que modèle mongoose le rendant dispo pour l'application Express */
module.exports = mongoose.model("Utilisateur", userSchema);