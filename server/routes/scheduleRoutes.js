const express = require("express");
const router = express.Router();
const { 
    createSchedule, 
    getAllSchedules,
    updateSchedule,
    deleteSchedule
} = require("../controllers/scheduleController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createSchedule);
router.get("/", verifyToken, getAllSchedules);
router.put("/:id", verifyToken, updateSchedule);
router.delete("/:id", verifyToken, deleteSchedule);

module.exports = router;