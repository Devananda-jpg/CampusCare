const Schedule = require("../models/Schedule");

// CREATE SCHEDULE (Admin Only)
exports.createSchedule = async (req, res) => {
    try {
        // Role check
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { taskName, area, date, time, repeatType } = req.body;

        let nextDate = null;
        const currentDate = new Date(date);

        // Calculate nextDate based on repeatType
        if (repeatType === "daily") {
            nextDate = new Date(currentDate);
            nextDate.setDate(nextDate.getDate() + 1);
        } 
        else if (repeatType === "weekly") {
            nextDate = new Date(currentDate);
            nextDate.setDate(nextDate.getDate() + 7);
        } 
        else if (repeatType === "monthly") {
            nextDate = new Date(currentDate);
            nextDate.setMonth(nextDate.getMonth() + 1);
        }

        const schedule = await Schedule.create({
            taskName,
            area,
            date: currentDate,
            time,
            repeatType,
            nextDate,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Schedule created successfully",
            schedule
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// GET ALL SCHEDULES (Logged-in users)
exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find().sort({ date: 1 });

        res.status(200).json({
            count: schedules.length,
            schedules
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
// UPDATE SCHEDULE (Admin Only)
exports.updateSchedule = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Admins only." });
        }

        const { id } = req.params;

        const updated = await Schedule.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.json({
            message: "Schedule updated",
            updated
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
// DELETE SCHEDULE (Admin Only)
exports.deleteSchedule = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Admins only." });
        }

        const { id } = req.params;

        await Schedule.findByIdAndDelete(id);

        res.json({ message: "Schedule deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};