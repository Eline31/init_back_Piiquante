const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();

const MY_PORT = process.env.PORT;

app.listen(MY_PORT, () => console.log(`Server running on port ${MY_PORT}`));