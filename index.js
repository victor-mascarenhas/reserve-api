const express = require("express");
const app = express();
const connectDB = require("./config/db");
var bodyparser = require("body-parser");
const PORT = process.env.PORT || 4646;

//Middlewares
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

//Mongo Connect
connectDB();

//Routes
app.get("/", (req, res) => res.send("Hello!"));
app.use("/user", require("./routes/api/user"));

const server = app.listen(PORT, () => {
  console.log(`Listening on: ${PORT}`);
});

module.exports = { app, server };
