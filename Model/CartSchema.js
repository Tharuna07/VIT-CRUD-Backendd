const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    img: { type: String, required: true },
    review: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    collection: "cartItem",
  }
);

module.exports = mongoose.model("cartItem", CartSchema);
