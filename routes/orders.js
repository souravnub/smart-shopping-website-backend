const express = require("express");
const Orders = require("../models/Orders");
const Products = require("../models/Products");
const Users = require("../models/Users");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fetchUser = require("../middlewares/fetchUser");

const router = express.Router();
dotenv.config();

// adding an order for a user
router.post("/addorder", async (req, res) => {
    try {
        try {
            req.body.orders.forEach(async (product) => {
                let product_to_update = await Products.findById(
                    product.product_id
                );

                product_to_update.available_quantity =
                    product_to_update.available_quantity - product.quantity;
                product_to_update.units_sold =
                    product_to_update.units_sold + product.quantity;

                const available_quantity = product_to_update.available_quantity;

                if (product_to_update.available_quantity === 0) {
                    await Products.findByIdAndUpdate(product.product_id, {
                        available_quantity: available_quantity,
                        in_stock: false,
                    });
                } else {
                    await Products.findByIdAndUpdate(
                        product.product_id,
                        product_to_update
                    );
                }
            });

            await Orders.create(req.body)
                .then(() => {
                    res.status(200).json({
                        success: true,
                        message: "order received successfully.",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: "Order was not placed.. some error occured.",
                    });
                });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "some internal server error ",
            });
        }
    } catch (error) {
        console.log(error);
    }
});

// editing an existing order
router.post("/edit", fetchUser, async (req, res) => {
    try {
        const { id, orderId } = req.query;

        if (req.is_admin) {
            const order = await Orders.findById(orderId);

            order.orders.forEach((o) => {
                if (o._id.toHexString() === id) {
                    o.order_status = req.body.order_status;
                }
            });

            Orders.findByIdAndUpdate(orderId, order)
                .then(() => {
                    res.json({
                        success: true,
                        message: "order editted successfully...",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: "something went wrong while editting order...",
                    });
                });
        } else {
            res.status(401).json({
                success: false,
                message: "unauthorized access are not allowed!",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(
            "some internal server error occured cannot edit order.."
        );
    }
});

// removing an existing order

router.post("/delete", fetchUser, async (req, res) => {
    try {
        const { id, orderId } = req.query;

        if (req.is_admin) {
            const order = await Orders.findById(orderId);

            order.orders = order.orders.filter(
                (o) => o._id.toHexString() !== id
            );

            if (order.orders.length === 0) {
                return Orders.findByIdAndDelete(orderId)
                    .then(() => {
                        res.json({
                            success: true,
                            message: "order removed successfully...",
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            success: false,
                            message:
                                "something went wrong while removing order...",
                        });
                    });
            }

            Orders.findByIdAndUpdate(orderId, order)
                .then(() => {
                    res.json({
                        success: true,
                        message: "order removed successfully...",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: "something went wrong while removing order...",
                    });
                });
        } else {
            res.status(401).json({
                success: false,
                message: "route avaliable to admin users only",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            messasge:
                "some internal server error occured ... cannot remove order",
        });
    }
});

// getting all orders corresponding to a user
router.get("/allorders", async (req, res) => {
    try {
        let userId = null;

        try {
            const data = jwt.verify(
                req.headers.token,
                process.env.JWT_SECRET_KEY
            );
            userId = data.userId;
        } catch (error) {
            res.status(404).json({
                success: false,
                message: "invalid authtoken.",
            });
        }

        try {
            const user = await Users.findById(userId).select("email");

            const orders = await Orders.find({
                user_email: user.email,
            }).select("orders createdAt order_status");

            res.status(200).json(orders);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "some internal server error occured..",
            });
        }
    } catch (error) {
        console.log(error);
    }
});

// getting all the orders in the shop
router.get("/allshoporders", fetchUser, async (req, res) => {
    try {
        if (req.is_admin) {
            const orders = await Orders.find();
            res.status(200).json({ success: true, orders });
        } else {
            res.status(401).json({
                success: false,
                message: "unauthorized access are not allowed!",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            sucess: false,
            message: "some internal server error occured.",
        });
    }
});

module.exports = router;
