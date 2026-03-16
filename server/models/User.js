const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function () {
      return this.role === "member"; // required for members
    }
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{10}$/ // enforce 10 digits for everyone
  },
  address: {
    type: String,
    required: function () {
      return this.role === "member"; // required for members
    }
  },
  savings: {
    type: Number,
    default: 0
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member"
  }
});

module.exports = mongoose.model("User", userSchema);
