const http = require("http");
const app = require("./app");

const server = http.createServer(app);
require("dotenv").config();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`server listen at ${PORT}`);
});
