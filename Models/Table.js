const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tableSchema = new Schema({
  tableNumber: { type: String, required: true },
  tableStatus: { type: String, default: "Free" },
});

module.exports = mongoose.model("Table", tableSchema);
