const express = require("express");
const router = express.Router();

const {
    createComplaint,
    getAllComplaints,
    getMyComplaints,
    updateComplaint,
    voteComplaint,
    deleteComplaint
} = require("../controllers/complaintController");

const { verifyToken } = require("../middleware/authMiddleware");

// User submits complaint
router.post("/", verifyToken, createComplaint);

// Admin views all complaints
router.get("/", verifyToken, getAllComplaints);

// User views own complaints
router.get("/my", verifyToken, getMyComplaints);

// Admin updates complaint (status + response)
router.put("/:id", verifyToken, updateComplaint);

// User votes complaint
router.post("/:id/vote", verifyToken, voteComplaint);

// User deletes resolved complaint
router.delete("/:id", verifyToken, deleteComplaint);

module.exports = router;