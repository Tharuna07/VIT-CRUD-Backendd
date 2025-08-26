const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phno: {
      type: String,
      required: true,
    },
  },
  {
    collection: "users",
  }
);
UserSchema.index({ username: 1, email: 1 }, { unique: true });
module.exports = mongoose.model("users", UserSchema);
