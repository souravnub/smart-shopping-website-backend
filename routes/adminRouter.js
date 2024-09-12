const express = require("express");
const fetchUser = require("../middlewares/fetchUser");
const { getDashboardData } = require("../controllers/adminController");

const router = express.Router();
// getting all data required for admin
router.get("/data", fetchUser, getDashboardData);

module.exports = router;
