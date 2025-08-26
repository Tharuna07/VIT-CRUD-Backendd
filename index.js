require("dotenv").config();
const path = require("path");
// Serve static files from the 'images' directory
console.log("MONGO_URI:", process.env.MONGO_URI);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cors = require("cors");

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.json());
app.use(cors());
app.use("/users", userRoutes);
app.use("/products", cartRoutes);

const dbConnect = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not set");

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    // Add connection options to handle timeouts better
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("Full error:", error);

    // Don't exit the process, just log the error
    console.log("⚠️  Server will continue without database connection");
  }
};

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Add a health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Add a test endpoint to check MongoDB connection
app.get("/test-db", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      res.json({
        status: "Connected",
        message: "MongoDB is connected and working",
      });
    } else {
      res.json({
        status: "Disconnected",
        message: "MongoDB is not connected",
        readyState: mongoose.connection.readyState,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  dbConnect();
});
