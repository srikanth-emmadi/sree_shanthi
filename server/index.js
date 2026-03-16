require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(express.json());

// Allow your Netlify URL to talk to this server
app.use(cors({
  origin: 'https://sree-shanthi-es.netlify.app' 
}));

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ DB connection error:", err));

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Server is running and connected to MongoDB Atlas!");
});

// ✅ Import routes
const dashboardRoutes = require("./routes/dashboard");
const authRoutes = require("./routes/auth");
const memberRoutes = require("./routes/members");
const userRoutes = require("./routes/userRoutes"); // <-- updated

// ✅ Use routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/users", userRoutes); // <-- mounted correctly



// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
