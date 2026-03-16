const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");
const Event = require("../models/Event");
const Member = require("../models/Member");

// Get all notices
router.get("/notices", async (req, res) => {
  try {
    const notices = await Notice.find();
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notices" });
  }
});

// Get all events
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events" });
  }
});

// Get all members
router.get("/members", async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: "Error fetching members" });
  }
});

module.exports = router;
