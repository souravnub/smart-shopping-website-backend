const express = require("express");

const dotenv = require("dotenv");
const authorizeUser = require("../middlewares/authorizeUser");
const {
    createOrder,
    updateOrder,
    deleteOrder,
    getAllOrdersForUser,
    getAllOrders,
} = require("../controllers/ordersController");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

const router = express.Router();
dotenv.config();

router.post("/addorder", createOrder);

router.get("/allorders", authorizeUser, getAllOrdersForUser);

router.post("/edit", authorizeAdmin, updateOrder);
router.post("/delete", authorizeAdmin, deleteOrder);
router.get("/allshoporders", authorizeAdmin, getAllOrders);

module.exports = router;
