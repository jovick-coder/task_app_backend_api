const { default: mongoose } = require("mongoose");

module.exports = new mongoose.model(
  "task",
  new mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String },
    uId: { type: String, required: true },
    done: { type: Boolean, required: true },
    date: { type: Date, default: Date.now },
    endDate: { type: String },
  })
);
