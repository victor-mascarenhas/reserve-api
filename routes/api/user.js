const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  let password = req.body.password;
  let newUser = new User(req.body);

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);
  await newUser.save();

  if (newUser) {
    res.json(newUser);
  } else {
    res.status(401).send({ msg: "Invalid User Data" });
  }
});

module.exports = router;
