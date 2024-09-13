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

const router = express.Router();
dotenv.config();

router.post("/addorder", createOrder);
router.post("/edit", authorizeUser, updateOrder);
router.post("/delete", authorizeUser, deleteOrder);
router.get("/allorders", getAllOrdersForUser);
router.get("/allshoporders", authorizeUser, getAllOrders);

module.exports = router;
