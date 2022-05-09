const express = require("express");
const fetchUser = require("../middlewares/fetchUser");
const Products = require("../models/Products");
const NewsLetter = require("../models/NewsLetter");
const Messages = require("../models/Messages");
const Orders = require("../models/Orders");
const Users = require("../models/Users");

const router = express.Router();
// getting all data required for admin
router.get("/data", fetchUser, async (req, res) => {
    try {
        if (req.is_admin) {
            const mostSoldProducts = await Products.find().sort({
                units_sold: -1,
            });
            const products = await Products.find().select(
                "_id name image_url price"
            );
            const newsLetterUsers = await NewsLetter.find();
            const users = await Users.find().select("-password");
            const orders = await Orders.find();
            const messages = await Messages.find();

            res.json({
                success: true,
                mostSoldProducts,
                products,
                newsLetterUsers,
                users,
                orders,
                messages,
            });
        } else {
            res.status(401).json({
                success: false,
                message: "route is available to admin users only ....",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "some internal server error occured...",
        });
    }
});

module.exports = router;
