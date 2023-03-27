const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();

passwordSchema
    .is().min(8)
    .is().max(100)
    .is().uppercase()
    .is().lowercase()
    .has().digits(2)
    .has().not().spaces()

console.log("passwordSchema", passwordSchema);

/**Vérification de la validité du mot de passe */
module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return res
            .status(400)
            .json({ error: `Le mot de passe n'est pas valide : ${passwordSchema.validate("req.body.password", { list: true })}` })
    }
};

