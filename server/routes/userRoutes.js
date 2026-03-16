const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// ✅ View users
// - Admins: get all users
// - Non-admins: get their own profile
router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const users = await User.find().select("-password"); // hide password
      return res.json(users);
    } else {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json(user);
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ✅ Create new user (admin only)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { name, phone, address, savings, role, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Name, phone, and password required" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      phone,
      address,
      savings,
      role,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json(await User.findById(newUser._id).select("-password"));
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// ✅ Edit user (admin only)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // 🔧 Updated option here
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" } // replaces new: true
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// ✅ Delete user (admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Non-admin: get own profile
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
});


module.exports = router;
