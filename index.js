require("dotenv").config();
const path = require("path");
const fs = require("fs");
// Serve static files from the 'images' directory
console.log("MONGO_URI:", process.env.MONGO_URI);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cors = require("cors");

// Configure CORS to allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files with proper headers
app.use("/images", express.static(path.join(__dirname, "images"), {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

app.use(express.json());
app.use("/users", userRoutes);
app.use("/products", cartRoutes);

const dbConnect = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");

    // Use environment variable or fallback to hardcoded URI
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb+srv://tharuna07:Tharuna@7@cluster0.utjdpwt.mongodb.net/";
    console.log("MONGO_URI:", mongoUri ? "Set" : "Not set");

    // Add connection options to handle timeouts better
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    await mongoose.connect(mongoUri, options);
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

// Add a test endpoint to list available images
app.get("/test-images", (req, res) => {
  try {
    const imagesDir = path.join(__dirname, "images");
    const files = fs.readdirSync(imagesDir);
    const imageFiles = files.filter(
      (file) =>
        file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg")
    );

    res.json({
      message: "Available images",
      count: imageFiles.length,
      images: imageFiles,
      baseUrl: `${req.protocol}://${req.get("host")}/images/`,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to read images directory",
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  dbConnect();
});
