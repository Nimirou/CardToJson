const express = require("express");
const routes = require("./routes/routes");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`app is running on PORT ${PORT}`);
});
module.exports = app;
