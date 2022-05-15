const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const Vehicle = require("../../models/vehicle");
const User = require("../../models/user");
const MSGS = require("../../messages");

// @route    GET /vehicle
// @desc     LIST vehicles
// @access   Private
router.get("/", async (req, res, next) => {
  try {
    const vehicle = await Vehicle.find({});
    res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: MSGS.GENERIC_ERROR });
  }
});

// @route    GET /vehicle/:id
// @desc     get a especific vehicle
// @access   Private
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    let vehicle = await Vehicle.findById(id);

    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).send({ error: MSGS.VEHICLE404 });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: MSGS.GENERIC_ERROR });
  }
});

// @route    POST /vehicle/register
// @desc     create vehicle
// @access   Public
router.post(
  "/register",
  [check("license", MSGS.LICENSE_VALIDATED).isLength({ min: 6 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        let newVehicle = new Vehicle(req.body);
        await newVehicle.save();

        if (newVehicle.id) {
          let user = await User.findById(newVehicle.owner);
          user.vehicles.push(newVehicle.id);
          await user.save();

          res.status(201).json(newVehicle);
        }
      }
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  }
);

//@route   DELETE/vehicle/:id
//@desc    DELETE vehicle
//@access  Private
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const vehicle = await Vehicle.findOneAndDelete({ _id: id });

    if (vehicle) {
      let user = await User.findById(vehicle.owner);
      user.vehicles.pull(id);
      await user.save();
      res.json(vehicle);
    } else {
      res.status(404).send({ error: MSGS.VEHICLE404 });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: MSGS.GENERIC_ERROR });
  }
});

//@route   PATCH/vehicle/:id
//@desc    PARTIAL UPDATE vehicle
//@access  Private
router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = { $set: req.body };
    const vehicle = await Vehicle.findByIdAndUpdate(id, update, { new: true });

    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).send({ error: MSGS.VEHICLE404 });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: MSGS.GENERIC_ERROR });
  }
});

module.exports = router;
