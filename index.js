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

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

module.exports = app;
