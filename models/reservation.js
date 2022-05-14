const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReservationSchema = new Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  paid: {
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
  spot: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "spot",
      required: true,
    },
  ],
});

module.exports = mongoose.model("reservation", ReservationSchema);
