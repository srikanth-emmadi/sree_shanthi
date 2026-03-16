const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// ✅ View members
router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      // Admins can see all members
      const members = await Member.find();
      return res.json(members);
    } else {
      // Regular member sees only their own details
      const member = await Member.findById(req.user.id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      return res.json(member);
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching members" });
  }
});

// ✅ Create new member (admin only)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { name, number, address, savings } = req.body;

    if (!name || !number) {
      return res.status(400).json({ message: "Name and phone number are required" });
    }

    const newMember = new Member({ name, number, address, savings });
    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ message: "Error creating member" });
  }
});

// ✅ Edit member (admin only)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updated = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating member" });
  }
});

// ✅ Delete member (admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deleted = await Member.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting member" });
  }
});

module.exports = router;
