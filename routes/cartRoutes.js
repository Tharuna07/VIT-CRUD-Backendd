const express = require("express");
const router = express.Router();
const CartItem = require("../Model/CartSchema");

router.post("/cartItems", async (req, res) => {
  console.log("📦 Incoming cart item data:", req.body);
  const { name, img, review, price } = req.body;

  // Validate required fields
  if (!name || !img || !review || !price) {
    console.error("❌ Missing required fields:", { name, img, review, price });
    return res.status(400).json({
      message: "Missing required fields: name, img, review, price",
    });
  }

  try {
    const newItem = new CartItem({ name, img, review, price });
    const savedItem = await newItem.save();
    console.log("✅ Item saved successfully:", savedItem);
    res.status(201).json({
      message: "Item added to cart successfully!",
      item: savedItem,
    });
  } catch (error) {
    console.error("❌ Error adding item to cart:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/cartItems", async (req, res) => {
  try {
    console.log("📋 Fetching cart items...");
    const cartItems = await CartItem.find();
    console.log(`✅ Found ${cartItems.length} cart items`);
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("❌ Error fetching cart items:", error);
    res.status(500).json({ message: "Failed to fetch cart items" });
  }
});

router.delete("/cartItems/:id", async (req, res) => {
  const itemId = req.params.id;
  console.log("🗑️ Deleting cart item with ID:", itemId);

  try {
    const deletedItem = await CartItem.findByIdAndDelete(itemId);

    if (!deletedItem) {
      console.log("❌ Item not found for deletion:", itemId);
      return res.status(404).json({ message: "Item not found in cart" });
    }

    console.log("✅ Item deleted successfully:", deletedItem);
    res.status(200).json({ message: "Item deleted from cart successfully" });
  } catch (error) {
    console.error("❌ Error deleting item from cart:", error);
    res.status(500).json({ message: "Failed to delete item from cart" });
  }
});

module.exports = router;
