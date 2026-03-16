const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // adjust path if needed
require("dotenv").config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing users
    await User.deleteMany({});

    // Hash passwords
    const adminPassword = await bcrypt.hash("admin123", 10);
    const raviPassword = await bcrypt.hash("ravi123", 10);
    const priyaPassword = await bcrypt.hash("priya123", 10);

    // Insert users
    const users = [
      {
        name: "System Admin",
        phone: "9999999999",
        address: "Head Office",
        savings: 0,
        password: adminPassword,
        role: "admin"
      },
      {
        name: "Ravi Kumar",
        phone: "8888888888",
        address: "Flat 101, Block A",
        savings: 5000,
        password: raviPassword,
        role: "member"
      },
      {
        name: "Priya Sharma",
        phone: "7777777777",
        address: "Flat 202, Block B",
        savings: 3000,
        password: priyaPassword,
        role: "member"
      }
    ];

    await User.insertMany(users);
    console.log("✅ Seeded admin and members successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
