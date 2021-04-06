const express = require("express");
const server = express();
const routes = require("./routes");

// Using template engine
server.set("view engine", "ejs");

// Enable static assets
server.use(express.static("public"));

server.use(express.urlencoded({ extended: true }));

// Routes
server.use(routes);

server.listen(3000, () => console.log("rodando"));
