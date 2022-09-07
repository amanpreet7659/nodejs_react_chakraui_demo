const express = require("express");
const routes = express();
const User = require("./user");
const imageTable = require("./image");
const path = require("path");

routes.use("/user", User);
routes.use("/image", imageTable);
routes.use("/uploads", express.static(path.join("backend", "uploads")));
module.exports = routes;
