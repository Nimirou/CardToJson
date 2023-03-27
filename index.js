const express = require("express");
const routes = require("./routes/routes");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var cors = require("cors");
app.use(cors());
app.use("/", routes);
const options = {
  key: fs.readFileSync("certificates/private.key"),
  cert: fs.readFileSync("certificates/certificate.crt"),
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running on`);
});

module.exports = app;
