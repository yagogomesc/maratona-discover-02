const express = require("express");
const server = express();
const routes = require("./routes");
const path = require("path");

// Using template engine
server.set("view engine", "ejs");

// Mudar a localização da pasta views
server.set("views", path.join(__dirname, "views"));

// Enable static assets
server.use(express.static("public"));

server.use(express.urlencoded({ extended: true }));

// Routes
server.use(routes);

server.listen(3000, () => console.log("rodando"));
