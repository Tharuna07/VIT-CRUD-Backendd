const express = require("express");
const router = express.Router();
const CartItem = require("../Model/ProductSchema");

router.post("/cartItems", async (req, res) => {
  const { name, img, review, price } = req.body;
  try {
    const newItem = new CartItem({ name, img, review, price });
    await newItem.save();
    res.status(201).json({ message: "Item added to cart successfully!" });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
});

router.get("/cartItems", async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Failed to fetch cart items" });
  }
});

router.delete("/cartItems/:id", async (req, res) => {
  const itemId = req.params.id;

  try {
    const deletedItem = await CartItem.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    res.status(200).json({ message: "Item deleted from cart successfully" });
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    res.status(500).json({ message: "Failed to delete item from cart" });
  }
});

module.exports = router;
