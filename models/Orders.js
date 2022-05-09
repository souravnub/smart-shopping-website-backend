const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema(
    {
        user_email: { type: String, required: true },
        buyer_info: {
            name: { type: String, required: true },
            phone: { type: Number, required: true },
            email: { type: String, required: true },
            location_info: {
                state: { type: String, required: true },
                city: { type: String, required: true },
                pincode: { type: Number, required: true },
                address: { type: String, required: true },
            },
        },
        orders: [
            {
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                order_status: { type: String, default: "pending" },
            },
        ],
        number_of_items: { type: Number, required: true },
        discount: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("orders", OrdersSchema);
