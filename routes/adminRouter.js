const express = require("express");
const authorizeUser = require("../middlewares/authorizeUser");
const { getDashboardData } = require("../controllers/adminController");

const router = express.Router();
// getting all data required for admin
router.get("/data", authorizeUser, getDashboardData);

module.exports = router;
