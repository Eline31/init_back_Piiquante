const mongoose = require("mongoose");
const emailValidator = require("email-validator");
// const uniqueValidator = require("mongoose-unique-validator");

/**Création d'un schéma de données contenant les champs souhaités */
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

emailValidator.validate(userSchema.email);

module.exports = mongoose.model("User", userSchema);

// userSchema.plugin(uniqueValidator);

