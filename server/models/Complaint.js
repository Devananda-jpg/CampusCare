const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved"],
        default: "Pending"
    },
    response: {
        type: String,
        default: ""
    },

    votes: {
        type: Number,
        default: 0
    },
    votedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);