const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    select: false,
  },
  vehicles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vehicle",
    },
  ],
});

module.exports = mongoose.model("user", UserSchema);
