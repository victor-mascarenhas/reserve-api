const mongoose = require("mongoose");
const { Schema } = mongoose;

const VehicleSchema = new Schema({
  license: { type: String, required: true },
  owner: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

module.exports = mongoose.model("vehicle", VehicleSchema);
