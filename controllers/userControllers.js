const user = require("../Model/UserSchema");

const createUser = async (req, res) => {
  const { username, email, password, address, phno } = req.body;

  try {
    const newuser = new user({ username, email, password, address, phno });

    await newuser.save();
    res.status(200).json({
      message: "User Created Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const delteduser = await user.findByIdAndDelete(id);
    if (!delteduser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(delteduser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
module.exports = { createUser, getUsers, deleteUser };
