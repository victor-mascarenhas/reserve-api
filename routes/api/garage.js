const express = require("express");
const router = express.Router();
const Garage = require("../../models/garage");
const Spot = require("../../models/spot");
const MSGS = require("../../messages");

// @route    GET /garage
// @desc     LIST garages
// @access   Public
router.get("/", async (req, res, next) => {
  try {
    const garage = await Garage.find({});
    res.json(garage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: MSGS.GENERIC_ERROR });
  }
});

// @route    GET /garage/:id
// @desc     get a especific garage
// @access   Private
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    let garage = await Garage.findById(id);

    if (garage) {
      res.json(garage);
    } else {
      res.status(404).send({ error: MSGS.GARAGE404 });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: MSGS.GENERIC_ERROR });
  }
});

// @route    POST /garage/register
// @desc     create garage
// @access   Private
router.post("/register", async (req, res) => {
  try {
    let newGarage = new Garage(req.body);
    await newGarage.save();

    if (newGarage.id) {
      res.status(201).json(newGarage);
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

//@route   DELETE/garage/:id
//@desc    DELETE garage
//@access  Private
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    let garage = await Garage.findOne({ _id: id });
    if (garage) {
      const spotsByGarage = await Spot.find({ garage: garage._id });
      if (spotsByGarage.lentgh > 0) {
        res.status(400).send({ error: MSGS.CANTDELETE });
      } else {
        await Garage.findOneAndDelete({ _id: id });
        res.json(garage);
      }
    } else {
      res.status(404).send({ error: MSGS.GARAGE404 });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: MSGS.GENERIC_ERROR });
  }
});

//@route   PATCH/garage/:id
//@desc    PARTIAL UPDATE garage
//@access  Private
router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = { $set: req.body };
    const garage = await Garage.findByIdAndUpdate(id, update, { new: true });

    if (garage) {
      res.json(garage);
    } else {
      res.status(404).send({ error: MSGS.GARAGE404 });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: MSGS.GENERIC_ERROR });
  }
});

module.exports = router;
