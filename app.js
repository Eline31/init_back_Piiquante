const app = require("./server");
// const userSchema = require("./models/user");
app.use((req, res) => {
    res.json({ message: "Requête reçue !" });
});
