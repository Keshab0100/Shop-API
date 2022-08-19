const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true, //Here we are connecting the product to orders
  },
  quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model("Orders", orderSchema);
