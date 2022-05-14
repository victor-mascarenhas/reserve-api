const mongoose = require("mongoose");
const { Schema } = mongoose;

const SpotSchema = new Schema({
  isOccupied: {
    type: Boolean,
    default: false,
  },
  garage: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "garage",
      required: true,
    },
  ],
  vehicle_type: {
    type: String,
    default: "REGULAR",
    enum: {
      values: ["COMPACT", "REGULAR", "LARGE"],
      message: "{VALUE} is not supported",
    },
  },
});

module.exports = mongoose.model("spot", SpotSchema);
