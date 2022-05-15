const mongoose = require("mongoose");
const { Schema } = mongoose;

const VehicleSchema = new Schema({
  license: { type: String, required: true },
  vehicle_type: {
    type: String,
    default: "REGULAR",
    enum: {
      values: ["COMPACT", "REGULAR", "LARGE"],
      message: "{VALUE} is not supported",
    },
  },
  owner: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  ],
});

module.exports = mongoose.model("vehicle", VehicleSchema);
