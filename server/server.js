const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const { verifyToken } = require("./middleware/authMiddleware");
const scheduleRoutes = require("./routes/scheduleRoutes");
const complaintRoutes = require("./routes/complaintRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/complaints", complaintRoutes);
app.get("/api/protected", verifyToken, (req, res) => {
    res.json({
        message: "Protected route accessed successfully",
        user: req.user
    });
});
// Test Route
app.get("/", (req, res) => {
    res.send("Campus Management Server Running 🚀");
});

// MongoDB Connection
mongoose.connect("mongodb+srv://anjithaaravind06_db_user:H1AopJ5XNLBrHwdG@campus-cluster.ptn6hag.mongodb.net/campusDB?appName=campus-cluster")
    .then(() => console.log("MongoDB Connected ✅"))
    .catch(err => console.log("MongoDB Error:", err));

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});