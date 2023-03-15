const http = require("http");
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();
const userSchema = require("./models/user");

const MY_PORT = process.env.PORT;
const MY_APP_SECRET = process.env.APP_SECRET;

app.get("/", (req, res, next) => {
    res.send(MY_APP_SECRET);
    next();
});

app.listen(MY_PORT, () => console.log(`Server running on port ${MY_PORT}`));



// /**Fonction de gestion des erreurs du serveur - elle les recherche et les gère de manière appropriée*/
// const errorHandler = error => {
//     if (error.syscall !== "listen") {
//         throw error;
//     }
//     const address = server.address();
//     const bind = typeof address === "string" ? "pipe" + address : "port:" + port;
//     switch (error.code) {
//         case "EACCES":
//             console.error(bind + " requires elevated privileges.");
//             process.exit(1);
//             break;
//         case "EADDRINUSE":
//             console.error(bind + " is already in use.");
//             process.exit(1);
//             break;
//         default:
//             throw error;
//     }
// };
// const server = http.createServer(app);

// server.on("error", errorHandler);
// server.on("listening", () => {
//     const address = server.address();
//     const bind = typeof address === "string" ? "pipe" + address : "port " + port;
//     console.log("Listening on " + bind);
// });
// server.listen(port);