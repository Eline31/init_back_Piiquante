const mongoose = require("mongoose");
const validator = require("validator");
// const emailValidator = require("email-validator");
// const passwordValidator = require("password-validator");
// const uniqueValidator = require("mongoose-unique-validator");

/**Création d'un schéma de données contenant les champs souhaités */
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// const schemaPassword = new passwordValidator();
// schemaPassword
//     .is().min(8)                                    // Minimum length 8
//     .is().max(100)                                  // Maximum length 100
//     .has().uppercase()                              // Must have uppercase letters
//     .has().lowercase()                              // Must have lowercase letters
//     .has().digits(2)                                // Must have at least 2 digits
//     .has().not().spaces()                           // Should not have spaces
//     .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// emailValidator.validate(userSchema.email);
// schemaPassword.validate(userSchema.password);

validator.isEmail("userSchema.email");
validator.isStrongPassword("userSchema.password");

module.exports = mongoose.model("User", userSchema);

// userSchema.plugin(uniqueValidator);

