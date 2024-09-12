const express = require("express");
const dotenv = require("dotenv");
const fetchUser = require("../middlewares/fetchUser");
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

router.get("/getallusers", fetchUser, getAllUsers);
router.post("/deleteuser/:id", fetchUser, deleteUser);
router.post("/promoteuser/:id", fetchUser, promoteUserToAdmin);

module.exports = router;
