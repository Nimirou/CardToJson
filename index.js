const express = require("express");
const routes = require("./routes/routes");
const app = express();
const fs = require("fs");
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var cors = require("cors");
app.use(cors());
app.use("/", routes);

app.listen(PORT, () => {});

module.exports = app;
