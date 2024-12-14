const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use("/users", userRoutes);
app.use("/products", cartRoutes);

const dbConnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://tharuna07:Tharuna@7@cluster0.utjdpwt.mongodb.net/"
    );
    console.log("database is connected");
  } catch (error) {
    console.log(error);
  }
};
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(4000, () => {
  dbConnect();
  console.log("server started on port 4000");
});
