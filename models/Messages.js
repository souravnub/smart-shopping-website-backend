const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema(
    {
        user: { type: String, required: true },
        responded: { type: Boolean, default: false },
        email: { type: String, required: true },
        message: { type: String, required: true },
        response_message: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("messages", MessagesSchema);
