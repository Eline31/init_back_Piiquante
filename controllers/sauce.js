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

/**Enregistre une nouvelle sauce et son image */
// instance du modèle Sauce
exports.createSauce = (req, res, next) => {
    // analyse de la requête pour obtenir un objet utilisable
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        // ...sauceObject = opérateur spread : copie les champs dans le body
        // de la request
        ...sauceObject,
        userId: req.auth.userId,
        // on modifie url de l'image avec une adresse dynamique valable aussi
        // en production
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

/**Enregistrement des likes et dislikes des utilisateurs pour une sauce */
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    if (like === 1) {
        Sauce.updateOne({ _id: req.params.id }, {
            $push: { usersLiked: req.body.userId },
            $inc: { likes: 1 }
        })
            .then(() => res.status(200).json({ message: "Votre like a bien été pris en compte !" }))
            .catch(error => res.status(400).json({ error }));
    } else if (like === -1) {
        Sauce.updateOne({ _id: req.params.id }, {
            $push: { usersDisliked: req.body.userId },
            $inc: { dislikes: 1 }
        })
            .then(() => res.status(200).json({ message: "Votre dislike a bien été pris en compte !" }))
            .catch(error => res.status(400).json({ error }));
    } else {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {
                        $pull: { usersLiked: req.body.userId },
                        $inc: { likes: - 1 }
                    })
                        .then(() => res.status(200).json({ message: "Votre like a bien été retiré !" }))
                        .catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {
                        $pull: { usersDisliked: req.body.userId },
                        $inc: { dislikes: - 1 }
                    })
                        .then(() => { res.status(200).json({ message: "Votre dislike a bien été retiré !" }) })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
};

/**Met à jour la sauce */
exports.updateSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    })
    .then(sauce => {
        if (sauce.userId !== req.auth.userId) {
            return res.status(403);
        }
        
        let sauceObjet = {};
        if (req.file) {
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlinkSync(`images/${filename}`)
            sauceObjet = {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            }
        } else {
            sauceObjet = {
                ...req.body
            }
        }

        return Sauce.updateOne({ _id: req.params.id }, { ...sauceObjet, _id: req.params.id })
    })
    .then(() => res.status(200).json({ message: 'votre sauce a bien été modifiée!' }))
    .catch(error => res.status(500).json({ error }));
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

