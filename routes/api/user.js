const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const MSGS = require("../../messages");

// @route    GET /user
// @desc     LIST users
// @access   Private
router.get("/", async (req, res, next) => {
  try {
    const user = await User.find({});
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: MSGS.GENERIC_ERROR });
  }
});

// @route    GET /user/:id
// @desc     get a especific user
// @access   Private
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    let user = await User.findById(id).populate("vehicles");

    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ error: MSGS.USER404 });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: MSGS.GENERIC_ERROR });
  }
});

// @route    POST /user/register
// @desc     create user
// @access   Public
router.post(
  "/register",
  [
    check("email", MSGS.VALID_EMAIL).isEmail(),
    check("name", MSGS.USER_NAME_REQUIRED).not().isEmpty(),
    check("password", MSGS.PASSWORD_VALIDATED).isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      let password = req.body.password;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        let newUser = new User(req.body);

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();

        if (newUser) {
          res.json(newUser);
        } else {
          res.status(401).send({ msg: "Invalid User Data" });
        }
      }
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  }
);

//@route   DELETE/user/:id
//@desc    DELETE user
//@access  Private
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findOneAndDelete({ _id: id });

    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ error: MSGS.USER404 });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: MSGS.GENERIC_ERROR });
  }
});

// @route    PATCH /user/:id
// @desc     PARTIAL EDIT user
// @access   Private
router.patch(
  "/:id",
  [check("email", MSGS.VALID_EMAIL).isEmail()],
  async (request, res, next) => {
    try {
      const id = request.params.id;
      const salt = await bcrypt.genSalt(10);
      let bodyRequest = request.body;

      if (bodyRequest.password) {
        bodyRequest.password = await bcrypt.hash(bodyRequest.password, salt);
      }
      const update = { $set: bodyRequest };
      const user = await User.findByIdAndUpdate(id, update, { new: true });
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ error: MSGS.USER404 });
      }
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  }
);

module.exports = router;
