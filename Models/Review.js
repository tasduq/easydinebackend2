const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  name: { type: String },
  review: { type: String },
  star: { type: String },
});

module.exports = mongoose.model("Review", reviewSchema);
