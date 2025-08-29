const express = require("express");
const router = express.Router();
const CartItem = require("../Model/CartSchema");

router.post("/cartItems", async (req, res) => {
  console.log("📦 Incoming cart item data:", req.body);
  const { userId, name, img, review, price } = req.body;

  if (!userId || !name || !img || !review || !price) {
    console.error("❌ Missing required fields:", {
      userId,
      name,
      img,
      review,
      price,
    });
    return res.status(400).json({
      message: "Missing required fields: userId, name, img, review, price",
    });
  }

  try {
    const newItem = new CartItem({ userId, name, img, review, price });
    const savedItem = await newItem.save();
    console.log("✅ Item saved successfully:", savedItem);
    res
      .status(201)
      .json({ message: "Item added to cart successfully!", item: savedItem });
  } catch (error) {
    console.error("❌ Error adding item to cart:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/cartItems", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    console.log("📋 Fetching cart items for user:", userId);
    const cartItems = await CartItem.find({ userId });
    console.log(`✅ Found ${cartItems.length} cart items for user ${userId}`);
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("❌ Error fetching cart items:", error);
    res.status(500).json({ message: "Failed to fetch cart items" });
  }
});

router.delete("/cartItems/:id", async (req, res) => {
  const itemId = req.params.id;
  const { userId } = req.query;
  console.log("🗑️ Deleting cart item:", { itemId, userId });

  try {
    const item = await CartItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    if (userId && item.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: item does not belong to user" });
    }
    await CartItem.findByIdAndDelete(itemId);
    res.status(200).json({ message: "Item deleted from cart successfully" });
  } catch (error) {
    console.error("❌ Error deleting item from cart:", error);
    res.status(500).json({ message: "Failed to delete item from cart" });
  }
});

module.exports = router;
