const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    repeatType: {
        type: String,
        enum: ["none", "daily", "weekly", "monthly"],
        default: "none"
    },
    nextDate: {
        type: Date
    },
   status: {
    type: String,
    enum: ["Scheduled", "In Progress", "Completed"],
    default: "Scheduled"
},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

module.exports = mongoose.model("Schedule", scheduleSchema);