const express = require("express");
const dotenv = require("dotenv");
const authorizeUser = require("../middlewares/authorizeUser");
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
router.get("/getuser", getUser);
router.post("/updateuser/:id", updateUser);

router.get("/getallusers", authorizeUser, getAllUsers);
router.post("/deleteuser/:id", authorizeUser, deleteUser);
router.post("/promoteuser/:id", authorizeUser, promoteUserToAdmin);

module.exports = router;
