const express = require("express");

const dotenv = require("dotenv");
const fetchUser = require("../middlewares/fetchUser");
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
router.post("/edit", fetchUser, updateOrder);
router.post("/delete", fetchUser, deleteOrder);
router.get("/allorders", getAllOrdersForUser);
router.get("/allshoporders", fetchUser, getAllOrders);

module.exports = router;
