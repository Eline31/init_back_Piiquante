const express = require("express");
const app = express();


// const userSchema = require("./models/user");
app.use((req, res) => {
    res.json({ message: "Requête reçue !" });
});

module.exports = app;