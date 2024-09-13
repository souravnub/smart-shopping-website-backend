const express = require("express");
const authorizeUser = require("../middlewares/authorizeUser");
const { getDashboardData } = require("../controllers/adminController");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

const router = express.Router();
// getting all data required for admin
router.get("/data", authorizeUser, authorizeAdmin, getDashboardData);

module.exports = router;
