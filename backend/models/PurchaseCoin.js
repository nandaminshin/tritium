const mongoose = require("mongoose");

const PurchaseCoinSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    coinAmount: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    receiptImage: {
      type: String,
      required: true,
    },
    approveStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseCoin", PurchaseCoinSchema);
