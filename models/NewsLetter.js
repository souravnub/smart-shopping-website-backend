const mongoose = require("mongoose");

const NewsLetterSchema = new mongoose.Schema(
    {
        user: { type: String, required: true },
        email: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("newsletter", NewsLetterSchema);
