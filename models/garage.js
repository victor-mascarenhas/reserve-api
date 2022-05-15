const mongoose = require("mongoose");
const { Schema } = mongoose;

const GarageSchema = new Schema({
  zipcode: { type: String, required: true, unique: true },
  rate_compact: { type: Number, required: true },
  rate_regular: { type: Number, required: true },
  rate_large: { type: Number, required: true },
  spots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "spot",
    },
  ],
});

module.exports = mongoose.model("garage", GarageSchema);
