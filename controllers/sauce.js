const Sauce = require("../models/Sauce");
const fs = require("fs");

/**Renvoie un tableau de toutes les sauces */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

/**Renvoie la sauce avec l'id fourni */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => { res.status(200).json(sauce) })
        .catch((error) => res.status(404).json({ error }));
};

/**On expose la logique de la route Post en tant que fonction appelée createSauce() */
/**Enregistre une nouvelle sauce et son image */
//Il me manque la gestion de l'image file
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Nouvelle sauce enregistrée !" }))
        .catch(error => res.status(400).json({ error }));
};

// /**Enregistrement des likes et dislikes des utilisateurs pour une sauce */
// exports.likeSauce = (req, res, next) => {
//     Sauce.findOne({ _id: req.params.id })
//         .then((sauce) => {
//             if (req.body.like = 1) {
//                 sauce.usersLiked.push(req.body.userId);
//                 sauce.likes++;
//                 res.status(200).json({ message: "Votre like a bien été pris en compte !" });
//             } if (req.body.like = 0) {
//                 sauce.usersLiked.filter((user) => user.userId !== req.body.userId);
//                 sauce.likes--;
//                 res.status(200).json({ message: "Votre like a bien été retiré !" });
//             } if (req.body.like = -1) {
//                 sauce.usersDisliked.push(req.body.userId);
//                 sauce.dislikes++;
//                 res.status(200).json({ message: "Votre dislike a bien été pris en compte !" });
//             } if (req.body.dislike = 0) {
//                 sauce.usersLiked.filter((user) => user.userId !== req.body.userId);
//                 sauce.dislikes--;
//                 res.status(200).json({ message: "Votre like a bien été retiré !" });
//             };
//         })
//         .catch(error => res.status(404).json({ error }));
// };

/**Enregistrement des likes et dislikes des utilisateurs pour une sauce */
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    const dislike = req.body.dislike;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (like === 1) {
                Sauce.updateOne({ _id: req.params.id }, {
                    $push: { usersLiked: req.body.userId },
                    $inc: { likes: sauce.likes++ }
                })
                    .then(() => res.status(200).json({ message: "Votre like a bien été pris en compte !" }))
                    .catch(error => res.status(400).json({ error }));
            } if (like === 0) {
                Sauce.updateOne({ _id: req.params.id }, {
                    $pull: { usersLiked: req.body.userId },
                    $inc: { likes: sauce.likes-- }
                })
                    .then(() => res.status(200).json({ message: "Votre like a bien été retiré !" }))
                    .catch(error => res.status(400).json({ error }));
            } if ((like === -1) || (dislike === 1)) {
                Sauce.updateOne({ _id: req.params.id }, {
                    $push: { usersDisliked: req.body.userId },
                    $inc: { dislikes: sauce.dislikes++ }
                })
                    .then(() => res.status(200).json({ message: "Votre dislike a bien été pris en compte !" }))
                    .catch(error => res.status(400).json({ error }));
            } if (dislike === 0) {
                Sauce.updateOne({ _id: req.params.id }, {
                    $pull: { usersDisliked: req.body.userId },
                    $inc: { dislikes: sauce.dislikes-- }
                })
                    .then(() => res.status(200).json({ message: "Votre dislike a bien été retiré !" }))
                    .catch(error => res.status(400).json({ error }));
            };
        })
        .catch(error => res.status(404).json({ error }));
};

/**Met à jour la sauce */
exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Pas autorisé" });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Votre sauce a bien été mise à jour !" }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => res.status(400).json({ error }));
};

/**Supprime la sauce */
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Pas autorisé" });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: "Votre sauce a bien été supprimée !" }))
                        .catch((error) => res.status(400).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

