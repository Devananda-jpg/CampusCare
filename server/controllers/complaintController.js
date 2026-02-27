const Complaint = require("../models/Complaint");

// =========================
// USER: Create Complaint
// =========================
exports.createComplaint = async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Only users can submit complaints." });
        }

        const { title, description, area } = req.body;

        const complaint = new Complaint({
            title,
            description,
            area,
            createdBy: req.user.id
        });

        await complaint.save();

        res.status(201).json({
            message: "Complaint submitted successfully",
            complaint
        });

    } catch (error) {
        res.status(500).json({ message: "Error submitting complaint" });
    }
};


// =========================
// ADMIN: View All Complaints
// =========================
exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("createdBy", "name email")
            .sort({ votes: -1 }); // show most voted first

        res.json({
            count: complaints.length,
            complaints
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching complaints" });
    }
};

// =========================
// USER: View Own Complaints
// =========================
exports.getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ createdBy: req.user.id })
            .sort({ createdAt: -1 });

        res.json({
            count: complaints.length,
            complaints
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching your complaints" });
    }
};


// =========================
// ADMIN: Respond / Update Status
// =========================
exports.updateComplaint = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Admins only." });
        }

        const { status, response } = req.body;

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status, response },
            { new: true }
        );

        res.json({
            message: "Complaint updated successfully",
            updatedComplaint
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating complaint" });
    }
};

// =========================
// USER: Vote Complaint
// =========================
exports.voteComplaint = async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Only users can vote." });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found." });
        }

        // Prevent duplicate voting
        if (complaint.votedUsers.some(userId => userId.toString() === req.user.id)) {
            return res.status(400).json({ message: "You already voted." });
        }

        complaint.votes += 1;
        complaint.votedUsers.push(req.user.id);

        await complaint.save();

        res.json({
            message: "Vote added successfully",
            votes: complaint.votes
        });

    } catch (error) {
        res.status(500).json({ message: "Error voting complaint" });
    }
};

// =========================
// USER: Delete Own Resolved Complaint
// =========================
exports.deleteComplaint = async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Only users can delete complaints." });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found." });
        }

        // Make sure user owns it
        if (complaint.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized." });
        }

        // Allow delete only if resolved
        if (complaint.status !== "Resolved") {
            return res.status(400).json({
                message: "You can only delete resolved complaints."
            });
        }

        await complaint.deleteOne();

        res.json({ message: "Complaint deleted successfully." });

    } catch (error) {
        res.status(500).json({ message: "Error deleting complaint." });
    }
};