const express = require("express");
const routes = require("./routes/routes");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);
var cors = require("cors");
app.use(cors());
app.listen(PORT, () => {});

module.exports = app;
