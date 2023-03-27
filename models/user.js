const mongoose = require("mongoose");
//const validator = require("validator");
// const emailValidator = require("email-validator");
// const passwordValidator = require("password-validator");
const uniqueValidator = require("mongoose-unique-validator");

/**Création d'un schéma de données contenant les champs souhaités */
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);

userSchema.plugin(uniqueValidator);

