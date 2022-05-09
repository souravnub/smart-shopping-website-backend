const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    image_url: { type: String, required: true },
    comments: [
        {
            user: { type: String },
            user_img: { type: String },
            comment: { type: String },
            user_rating: { type: Number },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    main_category: { type: String, required: true },
    other_categories: [String],
    description: { type: String },
    actualPrice: { type: Number },
    key_features: [{ type: String }],
    units_sold: { type: Number, default: 0 },

    available_quantity: { type: Number, required: true },
    in_stock: { type: Boolean, required: true },
});

module.exports = mongoose.model("products", ProductsSchema);
