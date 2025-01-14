const mongoose = require("mongoose");

const trendSchema = new mongoose.Schema({
    trendsArray: {
        type: Array,
        required: true, 
    },
    ip: {
        type: String,
        required: true, 
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
});

const Trend = mongoose.model("Trend", trendSchema);

module.exports = Trend;
