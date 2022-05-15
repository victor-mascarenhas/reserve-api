const express = require("express");
const router = express.Router();
const Garage = require("../../models/garage");
const Spot = require("../../models/spot");
const MSGS = require("../../messages");

// @route    GET /spot
// @desc     LIST spots
// @access   Public
router.get("/", async (req, res, next) => {
  try {
    const spot = await Spot.find({});
    res.json(spot);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: MSGS.GENERIC_ERROR });
  }
});

// @route    GET /spot/:id
// @desc     get a especific spot
// @access   Private
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    let spot = await Spot.findById(id);

    if (spot) {
      res.json(spot);
    } else {
      res.status(404).send({ error: MSGS.SPOT404 });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: MSGS.GENERIC_ERROR });
  }
});

// @route    POST /spot/register
// @desc     create spot
// @access   Private
router.post("/register", async (req, res) => {
  try {
    const garage = await Garage.findById(req.body.garage);
    if (garage) {
      let newSpot = new Spot(req.body);
      await newSpot.save();
      if (newSpot.id) {
        garage.spots.push(newSpot.id);
        await garage.save();
        res.status(201).json(newSpot);
      }
    } else {
      res.status(404).send({ error: MSGS.GARAGE404 });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

//@route   DELETE/spot/:id
//@desc    DELETE spot
//@access  Private
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    let spot = await Spot.findOneAndDelete({ _id: id });
    if (spot) {
      let garage = await Garage.findById(spot.garage);
      garage.spots.pull(id);
      await garage.save();
      res.json(spot);
    } else {
      res.status(404).send({ error: MSGS.SPOT404 });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: MSGS.GENERIC_ERROR });
  }
});

//@route   PATCH/spot/:id
//@desc    PARTIAL UPDATE spot
//@access  Private
router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = { $set: req.body };
    const spot = await Spot.findByIdAndUpdate(id, update, { new: true });

    if (spot) {
      res.json(spot);
    } else {
      res.status(404).send({ error: MSGS.SPOT404 });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: MSGS.GENERIC_ERROR });
  }
});

module.exports = router;
