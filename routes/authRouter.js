const express = require("express");
const dotenv = require("dotenv");
const authorizeUser = require("../middlewares/authorizeUser");
const authorizeAdmin = require("../middlewares/authorizeAdmin");
const {
    signUp,
    login,
    getUser,
    getAllUsers,
    deleteUser,
    promoteUserToAdmin,
    updateUser,
} = require("../controllers/authController");

dotenv.config();
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);

router.get("/getuser", authorizeUser, getUser);
router.post("/updateuser", authorizeUser, updateUser);

router.get("/getallusers", authorizeUser, authorizeAdmin, getAllUsers);
router.post("/deleteuser/:id", authorizeUser, authorizeAdmin, deleteUser);
router.post(
    "/promoteuser/:id",
    authorizeUser,
    authorizeAdmin,
    promoteUserToAdmin
);

module.exports = router;
