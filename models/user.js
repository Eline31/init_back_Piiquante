const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

/**Création d'un schéma de données contenant les champs souhaités */
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator, { type: "mongoose-unique-validator" });

module.exports = mongoose.model("User", userSchema);

