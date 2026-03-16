const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  address: { type: String, required: true },
  savings: { type: Number, default: 0 }
});

module.exports = mongoose.model("Member", memberSchema);
