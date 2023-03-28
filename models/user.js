const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

/**Modèle d'un utilisateur */
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator, { type: "mongoose-unique-validator" });

module.exports = mongoose.model("User", userSchema);