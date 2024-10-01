const InternalServerError = require("../errors/internal-server-error");
const Orders = require("../models/Orders");
const Products = require("../models/Products");
const Users = require("../models/Users");

const createOrder = async (req, res, next) => {
    try {
        req.body.orders.forEach(async (product) => {
            let product_to_update = await Products.findById(product.product_id);

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
                next(new InternalServerError());
            });
    } catch (error) {
        next(new InternalServerError());
    }
};

const updateOrder = async (req, res, next) => {
    const { id, orderId } = req.query;

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
            next(new InternalServerError());
        });
};

const deleteOrder = async (req, res, next) => {
    try {
        const { id, orderId } = req.query;
        const order = await Orders.findById(orderId);

        order.orders = order.orders.filter((o) => o._id.toHexString() !== id);

        if (order.orders.length === 0) {
            return Orders.findByIdAndDelete(orderId).then(() => {
                res.json({
                    success: true,
                    message: "order removed successfully...",
                });
            });
        }

        Orders.findByIdAndUpdate(orderId, order).then(() => {
            res.json({
                success: true,
                message: "order removed successfully...",
            });
        });
    } catch (error) {
        next(new InternalServerError());
    }
};

const getAllOrdersForUser = async (req, res, next) => {
    try {
        const user = await Users.findById(req.userId).select("email");

        const orders = await Orders.find({
            user_email: user.email,
        }).select("orders createdAt order_status");

        res.status(200).json(orders);
    } catch (error) {
        next(new InternalServerError());
    }
};

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Orders.find();
        res.status(200).json({ success: true, orders });
    } catch (error) {
        next(new InternalServerError());
    }
};

module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,
    getAllOrdersForUser,
    getAllOrders,
};
