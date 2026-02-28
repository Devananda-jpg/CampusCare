const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const { verifyToken } = require("./middleware/authMiddleware");
const scheduleRoutes = require("./routes/scheduleRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();

// 1. Connection logic that handles serverless "cold starts"
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        const db = await mongoose.connect("mongodb+srv://anjithaaravind06_db_user:H1AopJ5XNLBrHwdG@campus-cluster.ptn6hag.mongodb.net/campusDB?appName=campus-cluster", {
            serverSelectionTimeoutMS: 5000, // Don't let it hang forever
        });
        isConnected = db.connections[0].readyState;
        console.log("MongoDB Connected ✅");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        // Don't throw here, let the middleware handle the failure response
    }
};

// 2. Middleware to ensure DB is connected BEFORE routes run
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

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

app.get("/", (req, res) => {
    res.send("Campus Management Server Running 🚀");
});

// 3. Only listen if NOT on Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = 5000;
    app.listen(PORT, () => {
        console.log(`Local server running on port ${PORT}`);
    });
}

module.exports = app;