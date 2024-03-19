import User from "../models/user.model.js";
const emailPattern = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//Add new user
const createUser = async (req, res) => {
  try {
    const { name, surname, email } = req.body;
    let newUser = await User.findOne({ email: email });
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    } else if (newUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "Users collection is empty" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get user by email
const getUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update user
const updateUser = async (req, res) => {
  try {
    const { email } = req.params;
    const newUser = req.body;
    const updatedUser = await User.findOneAndUpdate({ email: email }, newUser, {
      new: false,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    } else if (!emailPattern.test(updatedUser.email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete user
const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOneAndDelete({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: `${user.name} ${user.surname} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllUsers, getUser, createUser, updateUser, deleteUser };
