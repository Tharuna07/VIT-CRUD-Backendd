const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "products",
  }
);
module.exports = mongoose.model("products", ProductSchema);
