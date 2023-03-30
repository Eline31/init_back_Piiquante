const app = require("./app");
const https = require("https");
const dotenv = require("dotenv");
dotenv.config();

const MY_PORT = process.env.PORT;

https.createServer(app).listen(MY_PORT, () => console.log(`Server running on port ${MY_PORT}`));