const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema(
    {
        user: { type: String, required: true },
        user_img: {
            type: String,
            default:
                "https://th.bing.com/th/id/OIP.Cj82nzkyLKNUurmJMcSiLgHaHa?w=180&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
        },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true },

        location_info: {
            state: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type: Number, required: true },
            address: { type: String, required: true },
        },
        is_admin: { type: Boolean, default: false },
        "news letter holder": { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("users", UsersSchema);
