const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    orderNumber: { type: String },
    orderTable: { type: String },
    orderStatus: { type: Number, default: 10 },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    orderAmount: { type: Number },
    paymentStatus: { type: Boolean },
    orderItems: { type: Array },
    userId: { type: String },
    userData: { type: Object },
    paymentDetails: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
